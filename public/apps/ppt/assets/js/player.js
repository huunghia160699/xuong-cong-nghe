import {courses} from '../data/tin-hoc-co-ban.js';
import {classGroups,classHasLesson} from '../data/classes.js';
import {renderSlide} from './engine/slide-renderer.js';
import {bindInteractions,resetInteraction} from './engine/interaction.js';
const params=new URLSearchParams(location.search);
const course=courses[params.get('course')||'tin-hoc-co-ban'];
const lesson=course?.lessons?.[params.get('lesson')||'buoi-01-file-explorer'];
const classId=params.get('class');
const selectedClass=classId ? classGroups[classId] : null;
const invalidClass=!!classId && (!selectedClass || !classHasLesson(selectedClass,course?.id,lesson?.id));
const $=id=>document.getElementById(id);
const deck=$('deck'),indicator=$('right-indicator'),progress=$('progress-bar');
let current=0,notesOpen=false,syncTimeout=null;
if(!lesson || invalidClass){deck.innerHTML='<main class="not-found"><h1>Không tìm thấy bài giảng</h1><a href="index.html">Về trang chủ</a></main>';}else{
 document.title=`${course.name} – ${lesson.label} – ${lesson.title}${selectedClass ? ' – '+selectedClass.name : ''}`;
 document.documentElement.dataset.deckReady='true';
 $('left-pill').innerHTML=`<span>${(selectedClass?.name || 'THƯ VIỆN CHUNG')}</span><span class="pill-separator">/</span><strong>${course.name}</strong>`;
 deck.innerHTML=lesson.slides.map(renderSlide).join('');
 indicator.innerHTML=lesson.slides.map((s,i)=>`<button class="indicator-dot" type="button" data-go="${i}" title="${i+1} · ${s.title}" aria-label="Trang ${i+1}: ${s.title}"></button>`).join('');
 bindInteractions(deck,lesson.slides);
 const slides=[...deck.querySelectorAll('.slide')];
 const clamp=v=>Math.max(0,Math.min(lesson.slides.length-1,v));
 function setCurrent(index){current=clamp(index);sync();}
 function go(index){setCurrent(index);deck.scrollTo({top:slides[current].offsetTop,behavior:'smooth'});}
 function sync(){
  $('page-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(lesson.slides.length).padStart(2,'0')}`;
  progress.style.width=`${(current+1)/lesson.slides.length*100}%`;
  indicator.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===current);b.setAttribute('aria-current',i===current?'step':'false')});
  const s=lesson.slides[current];$('notes-title').textContent=s.title;
  $('notes-content').textContent=s.notes||'Gợi ý: học viên có thể trả lời qua khung chat hoặc bằng micro.';
 }
 function toggleNotes(){notesOpen=!notesOpen;$('notes-panel').classList.toggle('show',notesOpen);}
 function revealNext(){const target=slides[current].querySelector('[data-reveal="pending"]');if(!target)return false;target.dataset.reveal='shown';return true;}
 indicator.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(Number(b.dataset.go));});
 deck.addEventListener('scroll',()=>{clearTimeout(syncTimeout);syncTimeout=setTimeout(()=>{
  const center=deck.scrollTop+deck.clientHeight/2;
  let nearest=0,dist=Infinity;
  slides.forEach((el,i)=>{const d=Math.abs(el.offsetTop+el.offsetHeight/2-center);if(d<dist){dist=d;nearest=i;}});
  if(nearest!==current)setCurrent(nearest);
 },70);},{passive:true});
 document.addEventListener('keydown',e=>{
  if(e.target.closest('input,textarea,[contenteditable="true"]'))return;
  const k=e.key;
  if(['ArrowRight','ArrowDown','PageDown',' '].includes(k)){e.preventDefault();if(!revealNext())go(current+1)}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(k)){e.preventDefault();go(current-1)}
  else if(k==='Home'){e.preventDefault();go(0)}
  else if(k==='End'){e.preventDefault();go(lesson.slides.length-1)}
  else if(k.toLowerCase()==='n'){toggleNotes()}
  else if(k.toLowerCase()==='r'){slides[current].querySelectorAll('[data-interaction="quiz"],[data-interaction="transfer"]').forEach(resetInteraction);slides[current].querySelectorAll('[data-reveal]').forEach(b=>b.dataset.reveal='pending')}
  else if(k.toLowerCase()==='f'){
   if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});
   else document.exitFullscreen?.();
  }
  else if(lesson.slides[current].layout==='quiz'&&/^[1-4a-dA-D]$/.test(k)){
   const n=/[1-4]/.test(k)?Number(k)-1:'abcd'.indexOf(k.toLowerCase());
   slides[current].querySelectorAll('[data-answer]')[n]?.click();
  }
 });
 sync();
}
