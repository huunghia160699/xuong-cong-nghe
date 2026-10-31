#!/usr/bin/env node
/** Chromium CDP smoke for D1-D7 public website; QA uses local Demo, not live credentials. */
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
 const routes=["/","/gioi-thieu","/bang-gia","/tin-tuc","/lien-he","/tin-tuc/gioi-thieu-he-sinh-thai-xuong-cong-nghe","/tin-tuc/huong-dan-bat-dau-voi-word-lab","/tin-tuc/huong-dan-su-dung-thu-vien-trinh-chieu"];
 for(const width of [360,430,768,1024,1280,1920]){
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
   const semantics=await evalJs(`(()=>({
    headingCount:document.querySelectorAll('main h1').length,
    hasMain:!!document.querySelector('main'),
    skip:!!document.querySelector('.xcn-public-skip'),
    canonical:!!document.querySelector('link[rel="canonical"]')
   }))()`);
   assert.equal(semantics.headingCount,1,"Expected one H1 "+route);
   assert.ok(semantics.hasMain&&semantics.skip,"Missing semantic main/skip link");
   assert.equal(semantics.canonical,true,"Missing canonical on "+route);
   if(route==="/tin-tuc"){
    const info=await evalJs(`(()=>({
      count:document.querySelector('.xcn-news-count')?.textContent,
      articles:document.querySelectorAll('.xcn-news-card').length,
      empty:!!document.querySelector('.xcn-news-empty')
    }))()`);
    assert.match(info.count??"",/3 bài viết đã xuất bản/);
    assert.equal(info.articles,3,"Expected three original published guides");
    assert.equal(info.empty,false,"Published guides should render cards");
    const chose=await evalJs(`(()=>{
     const b=[...document.querySelectorAll('.xcn-news-category')].find(x=>x.textContent?.includes('Hướng dẫn sử dụng'));
     if(!b)return false;b.click();return true;
    })()`);
    assert.ok(chose,"Missing news category filter");
    await wait(450);
    const selected=await evalJs(`(()=>({
      query:new URLSearchParams(location.search).get('category'),
      active:document.querySelector('.xcn-news-category[aria-pressed="true"]')?.textContent?.trim(),
      clear:!!document.querySelector('.xcn-news-clear')
    }))()`);
    assert.equal(selected.query,"Hướng dẫn sử dụng");
    assert.equal(selected.active,"Hướng dẫn sử dụng");
    assert.equal(selected.clear,true);
    assert.equal(await evalJs("document.querySelectorAll(\'.xcn-news-card\').length"),2,"Two usage guides should match");
    await evalJs("document.querySelector('.xcn-news-clear')?.click()");
    await wait(450);
    assert.equal(await evalJs("location.search"),"","Clear filters must reset URL");
    assert.equal(await evalJs("document.querySelectorAll(\'.xcn-news-card\').length"),3);
   }
   if(route.startsWith("/tin-tuc/")){
    assert.ok(await evalJs("document.querySelectorAll('.xcn-article-body section').length>=3"),"Published guide missing sections");
   }
   if(route==="/lien-he"){
    assert.equal(await evalJs("!!document.querySelector('main form, main input[type=submit]')"),false,"No fake contact form");
    await call("Page.navigate",{url:base+"/lien-he?topic=pricing"});
    await wait(800);
    assert.equal(await evalJs("document.querySelector('.xcn-contact-topic h3')?.textContent?.trim()"),"Tìm hiểu quyền sử dụng","Pricing link topic");
   }
   if(route==="/bang-gia"){
    assert.equal(await evalJs(`(()=>{
     const d=document.querySelector('.xcn-faq-list details');if(!d)return false;
     d.querySelector('summary')?.click();return d.open;
    })()`),true,"FAQ must open");
   }
   if(route==="/"){
    // D2 acceptance: filters update visible cards and announce counts, then reset.
    const initial=await evalJs("document.querySelectorAll('.xcn-atlas-card').length");
    assert.equal(initial,15,"Product Atlas must present all 15 catalog entries");
    const filteredClick=await evalJs(`(()=>{
     const button=[...document.querySelectorAll('.xcn-atlas-filter')].find(b=>b.textContent?.trim()==='Kiểm tra');
     if(!button)return false;
     button.click();return true;
    })()`);
    assert.equal(filteredClick,true,"Missing interactive Atlas filter");
    await wait(300);
    const filtered=await evalJs(`(()=>({
      count:document.querySelectorAll('.xcn-atlas-card').length,
      active:document.querySelector('.xcn-atlas-filter[aria-pressed="true"]')?.textContent?.trim(),
      announcement:document.querySelector('.xcn-atlas-count')?.textContent?.trim()
    }))()`);
    assert.equal(filtered.count,3,"Atlas filter should only show three testing tools");
    assert.equal(filtered.active,"Kiểm tra");
    assert.match(filtered.announcement,/Đang hiển thị 3 trong 15/);
    await evalJs("([...document.querySelectorAll('.xcn-atlas-filter')].find(b=>b.textContent?.trim()==='Tất cả'))?.click()");
    await wait(300);
    assert.equal(await evalJs("document.querySelectorAll('.xcn-atlas-card').length"),15,"Atlas reset must show all entries");
    const clicked=await evalJs(`(()=>{
      const toggle=innerWidth<1181
       ? document.querySelector('.xcn-public-mobile-toggle')
       : document.querySelector('.xcn-public-nav-toggle');
      if(!toggle)return false;
      toggle.click();return true;
    })()`);
    assert.equal(clicked,true,"Navigation toggle missing @"+width);
    // React state updates after the click handler, not synchronously inside DOM.evaluate.
    await wait(300);
    const interactive=await evalJs(`(()=>{
      if(innerWidth<1181){
       const toggle=document.querySelector('.xcn-public-mobile-toggle');
       return toggle?.getAttribute('aria-expanded')==='true'
         && !!document.querySelector('.xcn-public-mobile-panel');
      }
      const toggle=document.querySelector('.xcn-public-nav-toggle');
      return toggle?.getAttribute('aria-expanded')==='true'
        && document.querySelectorAll('.xcn-public-mega-item').length===7;
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
 const robotsResponse=await fetch(base+"/robots.txt");
 const sitemapResponse=await fetch(base+"/sitemap.xml");
 assert.equal(robotsResponse.status,200,"Missing robots.txt");
 assert.equal(sitemapResponse.status,200,"Missing sitemap.xml");
 const robotsText=await robotsResponse.text();
 const sitemapText=await sitemapResponse.text();
 assert.match(robotsText,/Disallow: \/admin\//);
 for(const route of ["/gioi-thieu","/bang-gia","/tin-tuc","/lien-he"])assert.ok(sitemapText.includes(route),"Sitemap missing "+route);
 console.log("PASS PUBLIC D1-D7 QA: 8 routes x 6 viewports, SEO, news filter, contact topic, FAQ, Atlas and menu/ESC");
}catch(error){console.error("PUBLIC VISUAL QA FAILED:",error);process.exitCode=1;}
finally{
 ws?.close();child?.kill("SIGTERM");await wait(150);if(profile)rmSync(profile,{recursive:true,force:true});
}
