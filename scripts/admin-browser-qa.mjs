#!/usr/bin/env node
/**
 * Admin visual smoke: Chrome DevTools Protocol, no third-party package.
 * Runs against the CI's local Next.js build in Demo, never live Supabase.
 * Captures viewport screenshots, DOM overflow, controls and keyboard focus.
 */
import {spawn} from "node:child_process";
import {mkdtempSync,readFileSync,existsSync,mkdirSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import assert from "node:assert/strict";

const base=process.env.ADMIN_QA_BASE??"http://127.0.0.1:3000";
const output=process.env.ADMIN_QA_OUTPUT??"/tmp/xcn-admin-qa";
mkdirSync(output,{recursive:true});
const chrome=process.env.CHROME_BIN??(
 ["/usr/bin/google-chrome","/usr/bin/google-chrome-stable","/usr/bin/chromium"]
 .find(p=>existsSync(p))??"google-chrome");
const profile=mkdtempSync(join(tmpdir(),"xcn-admin-chrome-"));
const child=spawn(chrome,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
 "--hide-scrollbars","--window-size=1440,900","--remote-debugging-port=0","--user-data-dir="+profile,"about:blank"],{stdio:"ignore"});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ws;let calls=new Map(),serial=0;
try{
 let port;
 for(let i=0;i<90;i++){
  if(child.exitCode!==null)throw Error("Chrome quit before remote debugging began");
  try{port=Number(readFileSync(join(profile,"DevToolsActivePort"),"utf8").split("\n")[0]);if(port)break;}catch{}
  await sleep(150);
 }
 if(!port)throw Error("Chrome debugging port unavailable");
 const target=await (await fetch("http://127.0.0.1:"+port+"/json/new?"+encodeURIComponent(base),{method:"PUT"})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
 ws.addEventListener("message",event=>{
  const item=JSON.parse(event.data);
  if(item.id&&calls.has(item.id)){
   const [resolve,reject]=calls.get(item.id);calls.delete(item.id);
   if(item.error)reject(Error(item.error.message));else resolve(item.result??{});
  }
 });
 function call(method,params={}){
  const id=++serial;return new Promise((resolve,reject)=>{calls.set(id,[resolve,reject]);ws.send(JSON.stringify({id,method,params}));});
 }
 async function evaluate(expression){
  const r=await call("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw Error("Browser JS exception: "+r.exceptionDetails.text);
  return r.result?.value;
 }
 await call("Page.enable");await call("Runtime.enable");
 async function visit(route,width,height=920){
  await call("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:width<=768});
  await call("Page.navigate",{url:base+route});
  for(let n=0;n<120;n++){
   const state=await evaluate("({ready:document.readyState, route:location.pathname,content:(document.querySelector('main')?.textContent??'').length})");
   if(state.ready==="complete"&&state.route===route&&state.content>60)break;
   await sleep(120);
   if(n===119)throw Error("Timeout loading "+route+" at "+width);
  }
  await sleep(850);
  const result=await evaluate(`(()=>({
   width:innerWidth,viewport:document.documentElement.clientWidth,
   scrollWidth:document.documentElement.scrollWidth,
   main:!!document.querySelector('main'),
   header:!!document.querySelector('header'),
   sidebarLinks:document.querySelectorAll('nav a').length,
   title:document.querySelector('h1')?.textContent??'',
   visibleControls:[...document.querySelectorAll('button,input,select,textarea,a')].filter(e=>{
    const r=e.getBoundingClientRect(),c=getComputedStyle(e);
    return r.width>0&&r.height>0&&c.visibility!=='hidden'&&c.display!=='none';
   }).length
  }))()`);
  if(!result.main)throw Error("Missing <main> "+route);
  if(result.scrollWidth>result.viewport+5)
    throw Error("Horizontal overflow "+route+" @ "+width+": "+result.scrollWidth+" > "+result.viewport);
  if(result.visibleControls<3)throw Error("Missing interaction controls "+route);
  const name=route.replaceAll("/","-").replace(/^-+/,"")||"home";
  const shot=await call("Page.captureScreenshot",{format:"png",fromSurface:true,captureBeyondViewport:false});
  writeFileSync(join(output,name+"-"+width+".png"),Buffer.from(shot.data,"base64"));
  console.log("PASS",route,width,"x",height,"controls",result.visibleControls,"h1",result.title);
  return result;
 }
 const routes=[
 "/admin","/admin/roadmap","/admin/sitemap","/admin/nguoi-dung","/admin/phan-quyen",
 "/admin/cau-hinh","/admin/nhat-ky","/admin/he-thong","/admin/bao-cao"
 ];
 for(const width of [360,768,1280]){
  for(const route of routes)await visit(route,width);
 }
 await visit("/admin/roadmap",360);
 const before=await evaluate("document.querySelector('[aria-label=\"Tìm trong roadmap\"]')?.value");
 assert.equal(before,"");
 const found=await evaluate(`(()=>{
  const input=document.querySelector('[aria-label="Tìm trong roadmap"]');
  if(!input)return false; input.focus();
  return document.activeElement===input;
 })()`);
 assert.equal(found,true,"Roadmap search must accept keyboard focus");
 const button=await evaluate(`(()=>{
  const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes("Xem khác biệt"));
  if(!btn)return false;
  btn.click(); return true;
 })()`);
 assert.equal(button,true,"Reconciliation panel must expand");
 await sleep(180);
 assert.equal(await evaluate("!!document.getElementById('xcn-roadmap-reconcile-details')"),true);
 await visit("/admin/cau-hinh",360);
 const form=await evaluate(`(()=>{
  const inputs=[...document.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width>0);
  return inputs.length>0 && !![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Lưu bản nháp'));
 })()`);
 assert.equal(form,true,"Settings editor is interactive");
 console.log("PASS keyboard focus, compare panel, settings controls");
}catch(error){console.error("ADMIN VISUAL QA FAILED:",error);process.exitCode=1;}
finally{
 ws?.close();child.kill("SIGTERM");
 await sleep(250);rmSync(profile,{recursive:true,force:true});
}
