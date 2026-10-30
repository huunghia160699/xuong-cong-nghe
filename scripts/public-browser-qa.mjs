#!/usr/bin/env node
/** Chromium CDP smoke for D1 public shell; QA uses local Demo, not live credentials. */
import {spawn} from "node:child_process";
import {mkdtempSync,existsSync,mkdirSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import assert from "node:assert/strict";
const base=process.env.PUBLIC_QA_BASE??"http://127.0.0.1:3000";
const output=process.env.PUBLIC_QA_OUTPUT??"/tmp/xcn-public-qa";
mkdirSync(output,{recursive:true});
const browser=process.env.CHROME_BIN??(["/usr/bin/google-chrome","/usr/bin/chromium"].find(existsSync)??"google-chrome");
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let child,profile,ws;const calls=new Map();let serial=0;
try{
 profile=mkdtempSync(join(tmpdir(),"xcn-public-chrome-"));
 child=spawn(browser,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--no-first-run","--hide-scrollbars","--remote-debugging-port=0","--window-size=1920,1000",
  "--user-data-dir="+profile,"about:blank"],{stdio:"ignore"});
 let port=0;
 for(let i=0;i<120;i++){
  if(child.exitCode!==null||child.signalCode)throw Error("Chromium closed during launch");
  try{port=Number(readFileSync(join(profile,"DevToolsActivePort"),"utf8").split("\n")[0]);if(port)break;}catch{}
  await wait(120);
 }
 if(!port)throw Error("Chrome debugging port unavailable");
 const target=await (await fetch("http://127.0.0.1:"+port+"/json/new?"+encodeURIComponent(base),{method:"PUT"})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
 ws.addEventListener("message",message=>{
  const item=JSON.parse(message.data);
  if(item.id&&calls.has(item.id)){
   const [resolve,reject]=calls.get(item.id);calls.delete(item.id);
   if(item.error)reject(Error(item.error.message));else resolve(item.result??{});
  }
 });
 const call=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++serial;calls.set(id,[resolve,reject]);ws.send(JSON.stringify({id,method,params}));
 });
 const evalJs=async expression=>{
  const r=await call("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw Error("Chrome JS: "+r.exceptionDetails.text);
  return r.result?.value;
 };
 await call("Page.enable");await call("Runtime.enable");
 const routes=["/","/gioi-thieu","/bang-gia","/tin-tuc","/lien-he"];
 for(const width of [360,768,1280,1920]){
  for(const route of routes){
   await call("Emulation.setDeviceMetricsOverride",{width,height:width===1280?680:900,deviceScaleFactor:1,mobile:width<=768});
   await call("Page.navigate",{url:base+route});
   let ready=false;
   for(let tries=0;tries<120;tries++){
    const state=await evalJs("({ready:document.readyState,path:location.pathname,heading:!!document.querySelector('main h1')})");
    if(state.ready==="complete"&&state.path===route&&state.heading){ready=true;break;}
    await wait(150);
   }
   if(!ready)throw Error("Page didn't render "+route+" @"+width);
   await wait(400);
   const info=await evalJs(`(()=>({
    viewport:document.documentElement.clientWidth,
    scrollWidth:document.documentElement.scrollWidth,
    title:document.querySelector('main h1')?.textContent?.trim(),
    header:!!document.querySelector('.xcn-public-header'),
    footer:!!document.querySelector('.xcn-public-footer'),
    navLinks:[...document.querySelectorAll('.xcn-public-desktop-nav a')].map(a=>a.textContent.trim()),
    style:getComputedStyle(document.querySelector('.xcn-public-header')).backgroundImage,
    footerStyle:getComputedStyle(document.querySelector('.xcn-public-footer')).backgroundImage
   }))()`);
   assert.ok(info.header&&info.footer,"Public shell missing "+route);
   assert.ok(info.title,"Missing H1 "+route);
   assert.ok(info.scrollWidth<=info.viewport+4,"Horizontal overflow "+route+" @"+width+": "+JSON.stringify(info));
   assert.equal(info.style,"none","Header gradient/background image is prohibited");
   assert.equal(info.footerStyle,"none","Footer gradient/background image is prohibited");
   const shot=await call("Page.captureScreenshot",{format:"png",fromSurface:true});
   writeFileSync(join(output,(route.slice(1)||"home")+"-"+width+".png"),Buffer.from(shot.data,"base64"));
   if(route==="/"){
    const interactive=await evalJs(`(()=>{
      const menu=document.querySelector('.xcn-public-mobile-toggle');
      const desktop=document.querySelector('.xcn-public-nav-toggle');
      if(innerWidth<1181){if(!menu)return false;menu.click();return menu.getAttribute('aria-expanded')==='true' && !!document.querySelector('.xcn-public-mobile-panel');}
      if(!desktop)return false;desktop.click();return desktop.getAttribute('aria-expanded')==='true' && document.querySelectorAll('.xcn-public-mega-item').length===7;
    })()`);
    assert.equal(interactive,true,"Menu interaction failed @"+width);
    await call("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"});
    await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape"});
    await wait(150);
    const closed=await evalJs("!document.querySelector('.xcn-public-mobile-panel') && !document.querySelector('.xcn-public-mega')");
    assert.equal(closed,true,"Escape did not close active navigation");
   }
   console.log("PASS PUBLIC",route,width,"h1",info.title);
  }
 }
 console.log("PASS D1 public shell 5 routes x 4 viewports + responsive menu/ESC");
}catch(error){console.error("PUBLIC VISUAL QA FAILED:",error);process.exitCode=1;}
finally{
 ws?.close();child?.kill("SIGTERM");await wait(150);if(profile)rmSync(profile,{recursive:true,force:true});
}
