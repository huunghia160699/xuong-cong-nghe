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

   const footerQA=await evalJs("(()=>{const el=document.querySelector('.xcn-public-footer');const nav=el?.querySelector('.xcn-public-footer-links');return {columns:nav?.querySelectorAll('.xcn-public-footer-column').length,gridCount:getComputedStyle(nav).gridTemplateColumns.split(' ').filter(Boolean).length,groups:[...nav.querySelectorAll('h2')].map(x=>x.textContent.trim()),links:nav.querySelectorAll('a').length,quick:el.querySelectorAll('.xcn-public-footer-quicklinks a').length,apps:el.querySelectorAll('.xcn-public-footer-apps a').length,locale:el.querySelector('.xcn-public-footer-locale')?.textContent.trim(),allLinks:[...el.querySelectorAll('a[href]')].map(x=>x.getAttribute('href'))}})()");
   assert.equal(footerQA.columns,4,"Footer must show four information groups @"+width);
   assert.equal(footerQA.gridCount,width<=700?2:4,"Footer grid must be responsive @"+width);
   assert.equal(footerQA.links,16,"Footer information links incomplete @"+width);
   assert.equal(footerQA.quick,3,"Footer shortcut icons missing @"+width);
   assert.equal(footerQA.apps,2,"Footer feature badges missing @"+width);
   assert.match(footerQA.locale,/Tiếng Việt/);
   assert.deepEqual(footerQA.groups,["Về Xưởng","Học & thực hành","Khám phá","Kết nối"]);
   assert.ok(footerQA.allLinks.every(href=>href&&href.startsWith("/")&&href!=="#"),"Footer has an unsupported link @"+width);

   const shot=await call("Page.captureScreenshot",{format:"png",fromSurface:true});
   writeFileSync(join(output,(route.slice(1)||"home")+"-"+width+".png"),Buffer.from(shot.data,"base64"));
   if(route==="/"){
    const homepage=await evalJs(`(()=>({
      root:!!document.querySelector('.xcn-workshop'),
      hero:!!document.querySelector('.ws-hero'),
      h1:document.querySelector('.ws-hero h1')?.textContent?.trim(),
      h1Count:document.querySelectorAll('main h1').length,
      headingPx:parseFloat(getComputedStyle(document.querySelector('.ws-hero h1')).fontSize),
      headingFont:getComputedStyle(document.querySelector('.ws-hero h1')).fontFamily,
      bodyFont:getComputedStyle(document.querySelector('.xcn-workshop')).fontFamily,
      heroCopy:document.querySelector('.ws-hero-copy>p:nth-of-type(2)')?.textContent?.trim(),
      backgroundImage:getComputedStyle(document.querySelector('.ws-hero')).backgroundImage,
      rolePaths:document.querySelectorAll('.ws-path-grid a.ws-path').length,
      photos:document.querySelectorAll('.ws-mosaic-photo').length,
      mosaicCTA:document.querySelector('.ws-mosaic-center a')?.getAttribute('href'),
      stories:document.querySelectorAll('.ws-journey-row').length,
      storyTrail:!!document.querySelector('.ws-journey-trail'),
      discovery:!!document.querySelector('.ws-discover-inner'),
      catalogRows:document.querySelectorAll('.ws-directory-row').length,
      areas:document.querySelectorAll('.ws-directory-row .ws-directory-area').length,
      statusBadges:document.querySelectorAll('.ws-directory-status').length,
      values:document.querySelectorAll('.ws-value-card').length,
      finalBanner:!!document.querySelector('.ws-photo-finale'),
      links:[...document.querySelectorAll('main a[href]')].map(a=>a.getAttribute('href')),
      gutter:parseFloat(getComputedStyle(document.querySelector('.xcn-container')).paddingLeft)
    }))()`);
    assert.ok(homepage.root&&homepage.hero&&homepage.discovery&&homepage.storyTrail&&homepage.finalBanner,"Community-first homepage is missing a section");
    assert.equal(homepage.h1Count,1,"Homepage must have one H1");
    assert.match(homepage.h1,/Nơi học tập trở thành/);
    assert.match(homepage.headingFont,/Noto[ _]Sans/,"Headings must render in Noto Sans with Vietnamese glyphs");
    assert.match(homepage.bodyFont,/Noto[ _]Sans/,"Homepage body must use the same Vietnamese-capable font");
    assert.ok(homepage.heroCopy?.length>35&&homepage.heroCopy.length<240,"Hero description should be concise");
    assert.ok(homepage.headingPx>=32&&homepage.headingPx<=86,"Responsive hero title outside expected range");
    assert.equal(homepage.backgroundImage,"none","Hero background must remain simple and white");
    assert.equal(homepage.rolePaths,4,"Four user role cards required");
    assert.equal(homepage.photos,9,"Photo mosaic must contain nine visual cards");
    assert.equal(homepage.mosaicCTA,"/cong-cu","Hero CTA should lead to existing tools");
    assert.equal(homepage.stories,5,"Five alternating learning stories required");
    assert.equal(homepage.catalogRows,8,"Eight ecosystem groups required");
    assert.equal(homepage.areas,8,"Every ecosystem group needs a topic label");
    assert.equal(homepage.statusBadges,0,"Homepage should not display development status badges");
    assert.equal(homepage.values,4,"Four learning values required");
    for(const href of ["/cong-cu/mo-phong-word","/cong-cu/trinh-chieu","/dang-nhap?next=%2Fstudent%2Fquiz","/khoa-hoc"])assert.ok(homepage.links.includes(href),"Missing real destination: "+href);
    if(width===360)assert.ok(homepage.headingPx<=40,"Mobile H1 is too large");
    if(width===1920)assert.ok(homepage.headingPx>=70,"Desktop H1 should remain prominent");
    if(width<1181){
     const opened=await evalJs("(()=>{const button=document.querySelector('.xcn-public-mobile-toggle');if(!button)return false;button.click();return true})()");
     assert.equal(opened,true,"Mobile navigation button missing @"+width);
     await wait(300);
     const visible=await evalJs("(()=>{const toggle=document.querySelector('.xcn-public-mobile-toggle');return toggle?.getAttribute('aria-expanded')==='true'&&!!document.querySelector('.xcn-public-mobile-panel')})()");
     assert.equal(visible,true,"Mobile navigation did not open @"+width);
     await call("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape"});
     await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape"});
     await wait(180);
     const closed=await evalJs("(()=>{const toggle=document.querySelector('.xcn-public-mobile-toggle');return toggle?.getAttribute('aria-expanded')==='false'&&!document.querySelector('.xcn-public-mobile-panel')})()");
     assert.equal(closed,true,"Escape did not close mobile navigation @"+width);
    }else{
     assert.equal(info.navLinks.length,5,"Desktop navigation should show five public routes");
    }
   }
   if(route==="/"){
    await evalJs("document.querySelector('.xcn-public-footer').scrollIntoView({block:'end'})");
    await wait(200);
    const footerShot=await call("Page.captureScreenshot",{format:"png",fromSurface:true});
    writeFileSync(join(output,"footer-"+width+".png"),Buffer.from(footerShot.data,"base64"));
    await evalJs("window.scrollTo(0,0)");
   }
   console.log("PASS PUBLIC",route,width,"h1",info.title);
  }
 }
 console.log("PASS D1 public shell 5 routes x 4 viewports + responsive menu/ESC");
}catch(error){console.error("PUBLIC VISUAL QA FAILED:",error);process.exitCode=1;}
finally{
 ws?.close();child?.kill("SIGTERM");await wait(150);if(profile)rmSync(profile,{recursive:true,force:true});
}
