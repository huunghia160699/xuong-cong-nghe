#!/usr/bin/env node
/**
 * Real Chromium contentEditable QA for Word Lab (local Demo, NEVER authenticated E2E).
 * Exercises actual toolbar onClick handlers and native keyboard/editing through CDP.
 * Does not edit application code, external data or Supabase.
 */
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {existsSync,mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
const base=process.env.WORD_QA_BASE??"http://127.0.0.1:3000";
const output=process.env.WORD_QA_OUTPUT??"/tmp/xcn-word-qa";
mkdirSync(output,{recursive:true});
const browser=process.env.CHROME_BIN??(["/usr/bin/google-chrome","/usr/bin/chromium"].find(existsSync)??"google-chrome");
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let chrome,profile,ws;let serial=0;const calls=new Map();const errors=[];const evidence=[];
function result(name,payload){console.log("PASS WORD "+name+" "+JSON.stringify(payload));evidence.push({name,detail:payload});}
try{
 profile=mkdtempSync(join(tmpdir(),"xcn-word-chrome-"));
 chrome=spawn(browser,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage",
  "--no-first-run","--remote-debugging-port=0","--window-size=1360,950",
  "--user-data-dir="+profile,"about:blank"],{stdio:"ignore"});
 let port=0;
 for(let i=0;i<120;i++){
  if(chrome.exitCode!==null||chrome.signalCode)throw Error("Chromium quit unexpectedly");
  try{port=Number(readFileSync(join(profile,"DevToolsActivePort"),"utf8").split("\n")[0]);if(port)break;}catch{}
  await wait(120);
 }
 assert.ok(port,"Chromium debugging port missing");
 const target=await(await fetch("http://127.0.0.1:"+port+"/json/new?"+encodeURIComponent(base),{method:"PUT"})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{
  ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});
 });
 ws.addEventListener("message",event=>{
  const msg=JSON.parse(event.data);
  if(msg.method==="Runtime.exceptionThrown"){
   const message=msg.params?.exceptionDetails?.exception?.description??msg.params?.exceptionDetails?.text??"Browser exception";
   errors.push(message.slice(0,500));
  }
  if(msg.id&&calls.has(msg.id)){
   const [resolve,reject]=calls.get(msg.id);calls.delete(msg.id);
   if(msg.error)reject(Error(msg.error.message));else resolve(msg.result??{});
  }
 });
 const call=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++serial;calls.set(id,[resolve,reject]);ws.send(JSON.stringify({id,method,params}));
 });
 const evaluate=async code=>{
  const r=await call("Runtime.evaluate",{expression:code,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails)throw Error("Chrome JS: "+(r.exceptionDetails.exception?.description??r.exceptionDetails.text));
  return r.result?.value;
 };
 const until=async(code,timeout=7000)=>{
  const attempts=Math.ceil(timeout/100);
  for(let i=0;i<attempts;i++){const v=await evaluate(code);if(v)return v;await wait(100);}
  throw Error("Timed out waiting for "+code.slice(0,95));
 };
 const click=async selector=>{
  const clicked=await evaluate(`(()=>{const n=document.querySelector(${JSON.stringify(selector)});if(!n)return false;n.click();return true})()`);
  assert.equal(clicked,true,"Cannot click "+selector);
  await wait(220);
 };
 const focusEnd=()=>evaluate(`(()=>{
  const editor=document.querySelector(".wsl-editor");
  const p=[...editor.querySelectorAll("p")].at(-1);
  if(!p)return false;
  const range=document.createRange();range.selectNodeContents(p);range.collapse(false);
  const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
  editor.focus();return true;
 })()`);
 const selectString=async str=>{
  const found=await evaluate(`(()=>{
   const root=document.querySelector(".wsl-editor");
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   let node;while(node=walker.nextNode()){
    const ix=node.data.indexOf(${JSON.stringify(str)});
    if(ix<0)continue;
    const range=document.createRange();range.setStart(node,ix);range.setEnd(node,ix+${str.length});
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    root.focus();document.dispatchEvent(new Event("selectionchange"));
    return selection.toString();
   }return null;
  })()`);
  assert.equal(found,str,"Cannot select "+str);await wait(150);
 };
 const screenshot=async name=>{
  const image=await call("Page.captureScreenshot",{format:"png",fromSurface:true});
  writeFileSync(join(output,name+".png"),Buffer.from(image.data,"base64"));
 };
 await call("Page.enable");
 await call("Runtime.enable");
 await call("Page.navigate",{url:base+"/cong-cu/mo-phong-word"});
 await until("document.readyState==='complete'&&!!document.querySelector('.wsl-editor .wsl-document-page')");
 await until("document.querySelector('.wsl-window-document input')?.value==='Document1'");
 const initial=await evaluate(`(()=>({
  pages:document.querySelectorAll('.wsl-document-page').length,
  tabs:[...document.querySelectorAll('.wsl-tab')].map(b=>b.textContent.trim()),
  editorEditable:document.querySelector('.wsl-editor')?.isContentEditable,
  width:Math.round(document.querySelector('.wsl-document-page').getBoundingClientRect().width)
 }))()`);
 assert.equal(initial.editorEditable,true,"Word editor must be editable");
 assert.ok(initial.pages>=1,"No physical A4 sheet");
 for(const name of ["File","Home","Insert","Design","Layout","References","Mailings","Review","View","Help"])
  assert.ok(initial.tabs.includes(name),"Missing Word tab "+name);
 result("shell and 10 tabs",initial);
 for(const width of [360,768,1280]){
  await call("Emulation.setDeviceMetricsOverride",{width,height:850,deviceScaleFactor:1,mobile:width<=768});
  await wait(180);
  const sizes=await evaluate(`(()=>({
    pageWidth:document.querySelector('.wsl-document-page').getBoundingClientRect().width,
    scrollWidth:document.querySelector('.wsl-page-scroll').scrollWidth,
    clientWidth:document.querySelector('.wsl-page-scroll').clientWidth,
    ribbonScrollable:document.querySelector('.wsl-ribbon').scrollWidth>=document.querySelector('.wsl-ribbon').clientWidth,
    editing:document.querySelector('.wsl-editor').isContentEditable
  }))()`);
  assert.ok(sizes.pageWidth>150&&sizes.editing,"Word sheet or editor missing at "+width);
  assert.ok(sizes.scrollWidth>=sizes.clientWidth,"Word horizontal page area dimension invalid");
  await screenshot("word-initial-"+width);
  result("layout "+width,sizes);
 }
 await call("Emulation.setDeviceMetricsOverride",{width:1280,height:850,deviceScaleFactor:1,mobile:false});
 assert.equal(await focusEnd(),true);
 await call("Input.insertText",{text:" WORDQA-VERIFY "});
 await until("document.querySelector('.wsl-editor')?.textContent?.includes('WORDQA-VERIFY')");
 result("native text input",{text:"WORDQA-VERIFY"});
 await selectString("WORDQA-VERIFY");
 await click('button[aria-label="Bold"]');
 const bold=await evaluate(`(()=>{
  const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
  let n;while(n=w.nextNode())if(n.data.includes("WORDQA-VERIFY"))return !!n.parentElement.closest("b,strong");
  return false;
 })()`);
 assert.equal(bold,true,"Bold must wrap selected text in a bold DOM element");
 result("selected Bold DOM",{bold});
 await click('button[aria-label="Show/Hide ¶"]');
 assert.equal(await evaluate("document.querySelector('.wsl-editor').classList.contains('show-paragraph-marks')"),true,"Paragraph marks toggle missing");
 await click('button[aria-label="Show/Hide ¶"]');
 result("paragraph marks toggle",{toggled:true});
 await click('button[aria-label="Save — Lưu bản nháp"]');
 const stored=await evaluate(`(()=>{
  const keys=Object.keys(localStorage);
  const data=keys.map(k=>{try{return JSON.parse(localStorage[k])}catch{return null}}).find(x=>x?.html?.includes("WORDQA-VERIFY"));
  return data?{found:true,pagesInHtml:/data-wsl-page|data-wsl-selection-gutter/.test(data.html),name:data.name}:null
 })()`);
 assert.equal(stored?.found,true,"Save should persist the edited content to localStorage");
 assert.equal(stored.pagesInHtml,false,"Visual sheet wrappers leaked into the saved document");
 result("save local draft",{found:true,name:stored.name,cleanPageWrappers:true});
 assert.equal(await focusEnd(),true);
 // Press Ctrl+Enter as a genuine browser key sequence (React onKeyDown).
 await call("Input.dispatchKeyEvent",{type:"keyDown",key:"Control",code:"ControlLeft",windowsVirtualKeyCode:17,modifiers:2});
 await call("Input.dispatchKeyEvent",{type:"rawKeyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,modifiers:2});
 await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,modifiers:2});
 await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Control",code:"ControlLeft",windowsVirtualKeyCode:17});
 const pagination=await until(`(()=>{
  const root=document.querySelector('.wsl-editor');
  const breaks=root.querySelectorAll('hr[data-wsl-manual-break]').length;
  const pages=root.querySelectorAll('.wsl-document-page').length;
  return breaks>=1&&pages>=2?{breaks,pages,status:document.querySelector('.wsl-statusbar')?.textContent?.trim()}:null;
 })()`,10000);
 await screenshot("word-ctrl-enter-page-break");
 result("Ctrl+Enter new A4 page",pagination);
 // The user's critical regression: typing AFTER Ctrl+Enter must start on page two.
 await call("Input.insertText",{text:"SECOND-PAGE-QA"});
 const onSecond=await until(`(()=>{
  const pages=[...document.querySelectorAll('.wsl-document-page')];
  return pages.length>=2&&pages[1].textContent?.includes('SECOND-PAGE-QA')&&
    !pages[0].textContent?.includes('SECOND-PAGE-QA');
 })()`);
 assert.equal(onSecond,true,"Caret after Ctrl+Enter must type into page two");
 result("caret stays on second page",{secondPageText:true});
 // Insert a real table via the toolbar, not direct DOM injection.
 assert.equal(await focusEnd(),true);
 await click('.wsl-tab:not(.is-active)' + ':nth-child(3)'); // Insert is third tab after File/Home.
 await until("document.querySelector('.wsl-ribbon')?.textContent?.includes('Bảng 3×3')");
 const beforeTables=await evaluate("document.querySelectorAll('.wsl-editor table').length");
 const added=await evaluate(`(()=>{
  const button=[...document.querySelectorAll('.wsl-ribbon button')].find(b=>b.getAttribute('aria-label')==="Bảng 3×3");
  if(!button)return false;button.click();return true;
 })()`);
 assert.equal(added,true,"Insert Table button unavailable");
 await until("document.querySelectorAll('.wsl-editor table').length>"+beforeTables);
 result("Insert table",{tables:await evaluate("document.querySelectorAll('.wsl-editor table').length")});
 await click('.wsl-tab:nth-child(5)'); // Layout
 const layout=await evaluate("document.querySelector('.wsl-ribbon')?.textContent?.includes('Hướng trang')");
 assert.equal(layout,true,"Layout controls missing");
 await click('.wsl-tab:nth-child(9)'); // View
 const oldZoom=await evaluate("document.querySelector('.wsl-zoom-value')?.textContent");
 await click('button[aria-label="Phóng to"]');
 const newZoom=await evaluate("document.querySelector('.wsl-zoom-value')?.textContent");
 assert.notEqual(oldZoom,newZoom,"View zoom button did not update");
 result("Layout + View zoom",{oldZoom,newZoom});
 // Save and reload: actual persistence with sanitization.
 await click('button[aria-label="Save — Lưu bản nháp"]');
 await call("Page.reload",{ignoreCache:true});
 await until("document.querySelector('.wsl-editor')?.textContent?.includes('WORDQA-VERIFY')",11000);
 const restored=await evaluate(`(()=>({
  text:document.querySelector('.wsl-editor')?.textContent?.includes('WORDQA-VERIFY'),
  tables:document.querySelectorAll('.wsl-editor table').length,
  breaks:document.querySelectorAll('.wsl-editor hr[data-wsl-manual-break]').length,
  pages:document.querySelectorAll('.wsl-document-page').length
 }))()`);
 assert.ok(restored.text&&restored.tables>=1&&restored.breaks>=1,"Draft rehydration dropped table/page break/text");
 result("save reload persistence",restored);
 // Real browser tests of delicate formatting that previously lost selection/markup.
 await selectString("WORDQA-VERIFY");
 await click('button[aria-label="Italic"]');
 const italic=await evaluate(`(()=>{
   const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
   let n;while(n=w.nextNode())if(n.data.includes('WORDQA-VERIFY'))return !!n.parentElement.closest('i,em');
   return false;
 })()`);
 assert.equal(italic,true,"Italic did not preserve the selected text");
 result("selected Italic DOM",{italic:true});
 await selectString("WORDQA-VERIFY");
 await click('button[aria-label="Subscript"]');
 const sub=await evaluate(`(()=>{
   const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
   let n;while(n=w.nextNode())if(n.data.includes('WORDQA-VERIFY'))return !!n.parentElement.closest('sub');
   return false;
 })()`);
 assert.equal(sub,true,"Subscript does not format the selected text");
 await selectString("WORDQA-VERIFY");
 await click('button[aria-label="Subscript"]');
 const unsub=await evaluate(`(()=>{
   const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
   let n;while(n=w.nextNode())if(n.data.includes('WORDQA-VERIFY'))return !n.parentElement.closest('sub');
   return false;
 })()`);
 assert.equal(unsub,true,"Subscript did not toggle OFF for selected text");
 result("Subscript on/off selected text",{applied:true,removed:true});
 await selectString("WORDQA-VERIFY");
 await click('button[aria-label="Mở tùy chọn Change Case"]');
 const changed=await evaluate(`(()=>{
  const b=[...document.querySelectorAll('[role="menuitem"]')].find(x=>x.textContent?.trim()==="chữ thường");
  if(!b)return false;b.click();return true;
 })()`);
 assert.equal(changed,true,"Change Case option not found");
 await until("document.querySelector('.wsl-editor')?.textContent?.includes('wordqa-verify')");
 const preserved=await evaluate(`(()=>{
  const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
  let n;while(n=w.nextNode())if(n.data.includes('wordqa-verify'))
    return !!n.parentElement.closest('b,strong')&&!!n.parentElement.closest('i,em');
  return false;
 })()`);
 assert.equal(preserved,true,"Change Case erased mixed bold/italic formatting");
 result("Change Case preserves inline styles",{lowercase:true,bold:true,italic:true});
 await selectString("wordqa-verify");
 await click('button[aria-label="Clear All Formatting"]');
 const clear=await evaluate(`(()=>{
  const w=document.createTreeWalker(document.querySelector('.wsl-editor'),NodeFilter.SHOW_TEXT);
  let n;while(n=w.nextNode())if(n.data.includes('wordqa-verify'))return !n.parentElement.closest('b,strong,i,em');
  return false;
 })()`);
 assert.equal(clear,true,"Clear Formatting kept bold/italic wrappers");
 result("Clear All Formatting",{cleared:true});
 // Denied OS clipboard must NEVER delete the selected original text.
 await selectString("wordqa-verify");
 const clipboardBefore=await evaluate("document.querySelector('.wsl-editor').textContent");
 const disabledCopy=await evaluate(`(()=>{
  window.__wordOriginalExec=document.execCommand;
  document.execCommand=function(cmd,...args){
   if(cmd==="cut")return false;
   return window.__wordOriginalExec.call(document,cmd,...args);
  };
  Object.defineProperty(navigator,"clipboard",{
   configurable:true,value:{writeText:()=>Promise.reject(new Error("clipboard permission denied"))}
  });
  return true;
 })()`);
 assert.equal(disabledCopy,true);
 await click('button[aria-label="Cut — Cắt"]');
 await wait(220);
 const clipboardAfter=await evaluate("document.querySelector('.wsl-editor').textContent");
 assert.equal(clipboardAfter,clipboardBefore,"Failed Cut must not remove ANY text");
 assert.ok(await evaluate("document.querySelector('.wsl-editor').textContent.includes('wordqa-verify')"));
 await evaluate("document.execCommand=window.__wordOriginalExec");
 result("denied Cut keeps all content",{unchanged:true});
 // Rich Sort must reorder entire DOM paragraphs (not insertText) and support
 // both Undo and Redo keyboard shortcuts after a programmatic transformation.
 const fixture=await evaluate(`(()=>{
  const root=document.querySelector(".wsl-editor");
  root.innerHTML="<p><b>Zulu</b> 2</p><p><i>Alpha</i> 1</p>";
  root.dispatchEvent(new InputEvent("input",{bubbles:true,inputType:"insertFromPaste"}));
  return root.textContent;
 })()`);
 assert.ok(fixture.includes("Zulu")&&fixture.includes("Alpha"));
 await until("document.querySelectorAll('.wsl-editor .wsl-document-page > p').length===2");
 const selectedSort=await evaluate(`(()=>{
  const paragraphs=[...document.querySelectorAll('.wsl-editor .wsl-document-page > p')];
  const range=document.createRange();range.selectNodeContents(paragraphs[0]);
  range.setEndAfter(paragraphs[1]);
  const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  document.querySelector(".wsl-editor").focus();document.dispatchEvent(new Event("selectionchange"));
  return selection.toString();
 })()`);
 assert.ok(selectedSort.includes("Zulu")&&selectedSort.includes("Alpha"));
 await click('button[aria-label="Sort"]');
 const richSorted=await until(`(()=>{
  const parts=[...document.querySelectorAll('.wsl-editor .wsl-document-page > p')];
  if(parts.length!==2||!parts[0].textContent.includes("Alpha"))return null;
  return {first:parts[0].textContent,second:parts[1].textContent,
   italic:!!parts[0].querySelector("i"),bold:!!parts[1].querySelector("b")};
 })()`);
 assert.ok(richSorted.italic&&richSorted.bold,"Sort flattened rich-text formatting");
 result("Sort keeps paragraph style nodes",richSorted);
 await focusEnd();
 const shortcut=async key=>{
  await call("Input.dispatchKeyEvent",{type:"rawKeyDown",key,code:"Key"+key.toUpperCase(),windowsVirtualKeyCode:key.toUpperCase().charCodeAt(0),modifiers:2});
  await call("Input.dispatchKeyEvent",{type:"keyUp",key,code:"Key"+key.toUpperCase(),windowsVirtualKeyCode:key.toUpperCase().charCodeAt(0),modifiers:2});
 };
 await shortcut("z");
 const undo=await until(`(()=>{
  const parts=[...document.querySelectorAll(".wsl-editor .wsl-document-page > p")];
  return parts.length===2&&parts[0].textContent.includes("Zulu")&&
   parts[0].querySelector("b")&&parts[1].querySelector("i");
 })()`);
 assert.equal(undo,true,"Ctrl+Z failed to undo rich Sort");
 await shortcut("y");
 const redo=await until(`(()=>{
  const parts=[...document.querySelectorAll(".wsl-editor .wsl-document-page > p")];
  return parts.length===2&&parts[0].textContent.includes("Alpha")&&
   parts[0].querySelector("i")&&parts[1].querySelector("b");
 })()`);
 assert.equal(redo,true,"Ctrl+Y failed to redo rich Sort");
 result("Ctrl+Z / Ctrl+Y preserve rich sort",{undo:true,redo:true});
 assert.equal(errors.length,0,"Browser runtime exceptions: "+errors.join("; "));
 console.log("PASS WORD REAL CHROMIUM: shell, 3 viewports, native typing, bold, marks, local save, Ctrl+Enter, table, zoom, reload.");
}catch(error){
 console.error("WORD BROWSER QA FAILED:",error.stack??String(error));process.exitCode=1;
}finally{
 writeFileSync(join(output,"audit-results.json"),JSON.stringify({evidence,errors,passed:process.exitCode!==1},null,2));
 ws?.close();chrome?.kill("SIGTERM");await wait(120);
 if(profile)rmSync(profile,{recursive:true,force:true});
}
