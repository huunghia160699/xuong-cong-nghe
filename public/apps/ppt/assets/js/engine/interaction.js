import {renderFileTiles} from './components.js';
/** Delegated handlers work for every lesson and newly added slide component. */
export function bindInteractions(container,slides=[]){
 container.addEventListener('click',e=>{
  const answer=e.target.closest('[data-answer]');
  if(answer){
   const host=answer.closest('[data-interaction="quiz"]');
   const choice=Number(answer.dataset.answer),correct=Number(host.dataset.correct);
   host.querySelectorAll('[data-answer]').forEach(b=>{
    b.classList.toggle('is-correct',Number(b.dataset.answer)===correct);
    b.classList.toggle('is-wrong',Number(b.dataset.answer)===choice&&choice!==correct);
   });
   const feedback=host.querySelector('.quiz-feedback');feedback.hidden=false;
   feedback.classList.toggle('is-wrong',choice!==correct);
   feedback.querySelector('strong').textContent=choice===correct?'CHÍNH XÁC':'CHƯA CHÍNH XÁC';
   feedback.querySelector('p').textContent=host.dataset.explanation;
   return;
  }
  const reset=e.target.closest('[data-quiz-reset]');
  if(reset){const host=reset.closest('[data-interaction="quiz"]');resetInteraction(host);return;}
  const folder=e.target.closest('[data-explorer-folder]');
  if(folder){const host=folder.closest('[data-interaction="explorer"]');
   const selected=Number(folder.dataset.explorerFolder);const data=JSON.parse(host.dataset.folders);
   host.querySelectorAll('[data-explorer-folder]').forEach((b,i)=>b.classList.toggle('selected',i===selected));
   host.querySelector('[data-explorer-path]').textContent='This PC › '+data[selected].name;
   host.querySelector('[data-explorer-files]').innerHTML=renderFileTiles(data[selected]);return;
  }
  const transferRun=e.target.closest('[data-transfer-run]');
  if(transferRun){const host=transferRun.closest('[data-interaction="transfer"]');const fn=host.dataset.filename;
   host.querySelector('[data-transfer-destination]').textContent=fn;
   host.querySelector('[data-transfer-destination]').classList.replace('transfer-placeholder','transfer-file');
   if(host.dataset.mode==='move'){host.querySelector('[data-transfer-source]').textContent='Không còn tệp';host.querySelector('[data-transfer-source]').classList.replace('transfer-file','transfer-placeholder');}
   transferRun.disabled=true;return;
  }
  const transferReset=e.target.closest('[data-transfer-reset]');
  if(transferReset){resetInteraction(transferReset.closest('[data-interaction="transfer"]'));return;}
  const hotspot=e.target.closest('[data-hotspot]');
  if(hotspot){const host=hotspot.closest('[data-interaction="hotspot"]');host.querySelectorAll('[data-hotspot]').forEach(p=>p.classList.toggle('is-selected',p===hotspot));host.querySelector('[data-hotspot-result]').textContent=hotspot.dataset.hotspotText;}
 });
 // Dataset is set once after render; content stays separate from HTML templates.
 for(const explorer of container.querySelectorAll('[data-interaction="explorer"]')){
   const slide=slides.find(s=>s.blocks?.some(b=>b.type==='explorer'&&explorer.dataset.key.startsWith(s.id)));
   const block=slide?.blocks.find(b=>b.type==='explorer');
   if(block) explorer.dataset.folders=JSON.stringify(block.folders);
 }
}
export function resetInteraction(host){
 if(!host)return;
 if(host.dataset.interaction==='quiz'){
  host.querySelectorAll('[data-answer]').forEach(b=>b.classList.remove('is-correct','is-wrong'));
  const feedback=host.querySelector('.quiz-feedback');feedback.hidden=true;feedback.classList.remove('is-wrong');
 } else if(host.dataset.interaction==='transfer'){
  const src=host.querySelector('[data-transfer-source]'),dst=host.querySelector('[data-transfer-destination]');
  src.textContent=host.dataset.filename;
  src.className='transfer-file';dst.textContent='Chưa có tệp';dst.className='transfer-placeholder';
  host.querySelector('[data-transfer-run]').disabled=false;
 }
}
