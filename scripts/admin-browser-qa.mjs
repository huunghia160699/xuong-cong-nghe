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
 // Viewport-height QA: on short desktops only nav scrolls, footer remains visible.
 await visit("/admin",1280,680);
 const shortSidebar=await evaluate(`(()=>{
  const frame=document.querySelector('aside.xcn-admin-sidebar-frame');
  const nav=frame?.querySelector('.xcn-admin-sidebar-nav');
  const footer=frame?.querySelector('.xcn-admin-sidebar-footer');
  const link=nav?.querySelector('a');
  if(!frame||!nav||!footer||!link)return null;
  return {font:parseFloat(getComputedStyle(link).fontSize),
   footerBottom:footer.getBoundingClientRect().bottom,
   navHeight:nav.clientHeight,navContent:nav.scrollHeight,
   frameHeight:frame.getBoundingClientRect().height,viewport:innerHeight};
 })()`);
 assert.ok(shortSidebar,"Admin sidebar should be rendered on desktop");
 assert.ok(shortSidebar.font>=14,"Admin links must remain readable on a short screen");
 assert.ok(shortSidebar.navContent>shortSidebar.navHeight,"Short screen should scroll the nav instead of shrinking links");
 assert.ok(shortSidebar.footerBottom<=shortSidebar.viewport+1,"Admin status must remain visible on short screens");
 await visit("/admin",1280,1080);
 const tallSidebar=await evaluate(`(()=>{
  const frame=document.querySelector('aside.xcn-admin-sidebar-frame');
  const nav=frame?.querySelector('.xcn-admin-sidebar-nav');
  const footer=frame?.querySelector('.xcn-admin-sidebar-footer');
  const link=nav?.querySelector('a');
  if(!frame||!nav||!footer||!link)return null;
  return {font:parseFloat(getComputedStyle(link).fontSize),
   footerBottom:footer.getBoundingClientRect().bottom,
   navHeight:nav.clientHeight,navContent:nav.scrollHeight,
   viewport:innerHeight};
 })()`);
 assert.ok(tallSidebar?.font>shortSidebar.font,"Tall screens should display larger Admin navigation");
 assert.ok(tallSidebar.navContent<=tallSidebar.navHeight+2,"Tall screen should fit the full Admin navigation");
 assert.ok(tallSidebar.footerBottom<=tallSidebar.viewport+1,"Admin status must remain visible on tall screens");
 console.log("PASS Admin sidebar height adaptive 680px/1080px",shortSidebar,tallSidebar);
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
 const dialogOpened=await evaluate(`(()=>{
  const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Thêm việc lớn');
  btn?.click();return !!btn;
 })()`);
 assert.equal(dialogOpened,true);
 await sleep(120);
 assert.equal(await evaluate("!!document.querySelector('[role=dialog][aria-modal=true]')"),true);
 assert.equal(await evaluate("document.querySelector('[role=dialog]')?.contains(document.activeElement)"),true);
 await call("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"});
 await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape"});
 await sleep(150);
 assert.equal(await evaluate("!!document.querySelector('[role=dialog]')"),false,"Escape should close editor");
 await visit("/admin",360);
 const menuOpened=await evaluate(`(()=>{
  const button=document.querySelector('button[aria-label="Mở menu"]');
  if(!button)return false;button.click();return true;
 })()`);
 assert.equal(menuOpened,true,"mobile sidebar toggle missing");
 await sleep(90);
 assert.equal(await evaluate("document.querySelector('button[aria-label=\"Mở menu\"]')?.getAttribute('aria-expanded')"),"true");
 await visit("/admin/cau-hinh",360);
 const form=await evaluate(`(()=>{
  const inputs=[...document.querySelectorAll('input')].filter(i=>i.getBoundingClientRect().width>0);
  return inputs.length>0 && !![...document.querySelectorAll('button')].find(b=>b.textContent.includes('Lưu bản nháp'));
 })()`);
 assert.equal(form,true,"Settings editor is interactive");
 console.log("PASS keyboard focus, modal focus trap/Escape, mobile menu, compare panel and settings controls");
}catch(error){console.error("ADMIN VISUAL QA FAILED:",error);process.exitCode=1;}
finally{
 ws?.close();child.kill("SIGTERM");
 await sleep(250);rmSync(profile,{recursive:true,force:true});
}
