import {siteData} from '../data/site.js';
(function homepageApp(){
 const $=id=>document.getElementById(id);
 const escape=str=>String(str??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
 const subjects=siteData.courses,classes=siteData.classes;
 const params=new URLSearchParams(location.search);
 let chosen=classes.some(c=>c.id===params.get("class"))?params.get("class"):"",search="";
 $("course-total").textContent=String(subjects.length).padStart(2,"0");
 $("class-total").textContent=String(classes.length).padStart(2,"0");
 $("lesson-total").textContent=String(subjects.reduce((n,c)=>n+c.lessons.length,0)).padStart(2,"0");
 $("slide-total").textContent=subjects.reduce((n,c)=>n+c.lessons.reduce((x,l)=>x+l.slideCount,0),0);
 $("welcome-course-count").textContent=String(subjects.length).padStart(2,"0");
 $("welcome-class-count").textContent=String(classes.length).padStart(2,"0");
 const select=$("class-select");
 select.innerHTML='<option value="">Tất cả lớp (bài giảng chung)</option>'+classes.map(c=>`<option value="${escape(c.id)}">${escape(c.name)}</option>`).join("");
 select.value=chosen;
 const link=(c,l)=>`slides.html?course=${encodeURIComponent(c.id)}&lesson=${encodeURIComponent(l.id)}${chosen?"&class="+encodeURIComponent(chosen):""}`;
 const matching=text=>!search || String(text).toLocaleLowerCase("vi").includes(search);
 function renderCourses(){
  const rows=subjects.filter(c=>(!chosen||c.classes.some(x=>x.id===chosen))&&matching([c.name,c.description,...c.lessons.flatMap(l=>[l.title,l.subtitle]),...c.classes.map(x=>x.name)].join(" ")));
  $("course-grid").innerHTML=rows.map(c=>{
   const group=classes.find(x=>x.id===chosen);
   const ofr=group?.offerings.find(x=>x.courseId===c.id);
   const lessons=ofr?c.lessons.filter(l=>ofr.lessonIds.includes(l.id)):c.lessons;
   return `<article class="course-card">
    <header class="course-card-head"><div><span class="eyebrow">MÔN HỌC</span><h3>${escape(c.name)}</h3></div><span class="subject-count">${lessons.length} bài giảng</span></header>
    <p>${escape(c.description)}</p>
    <div class="course-classes"><span>Áp dụng cho:</span>${c.classes.map(g=>`<button class="class-chip ${chosen===g.id?"is-selected":""}" type="button" data-filter-class="${escape(g.id)}">${escape(g.name)}</button>`).join("")||'<span class="muted-meta">Chưa phân lớp</span>'}</div>
    <div class="lesson-list">${lessons.map(l=>`<a class="lesson-row" href="${link(c,l)}"><span class="lesson-meta">${escape(l.label)} · ${l.slideCount} slide</span><strong>${escape(l.title)}</strong><span class="lesson-open">Mở bài giảng →</span></a>`).join("")||'<p class="empty-state">Lớp này chưa được phân bài giảng.</p>'}</div></article>`;
  }).join("")||'<p class="empty-state">Không tìm thấy môn học hoặc bài giảng phù hợp.</p>';
  $("filter-caption").textContent=chosen?`Đang xem bài giảng của lớp ${classes.find(c=>c.id===chosen)?.name}`:"Một bài giảng được sử dụng chung cho nhiều lớp";
 }
 function renderClasses(){
  const rows=classes.filter(c=>matching([c.name,c.schoolYear,c.description,...c.offerings.map(o=>o.name)].join(" ")));
  $("class-grid").innerHTML=rows.map(c=>{
    const lessons=c.offerings.reduce((count,o)=>count+o.lessonIds.length,0);
    return `<article class="group-card">
     <header class="group-card-head"><span class="group-icon">${escape(c.name.slice(0,2))}</span><span class="muted-meta">${escape(c.schoolYear)}</span></header>
     <h3>${escape(c.name)}</h3><p>${escape(c.description)}</p>
     <div class="group-overview"><span>${c.offerings.length} môn học</span><span>${lessons} bài giảng</span></div>
     <button class="group-action" type="button" data-filter-class="${escape(c.id)}">Xem bài giảng của lớp <span>→</span></button></article>`;
  }).join("")||'<p class="empty-state">Không tìm thấy lớp học phù hợp.</p>';
 }
 function chooseClass(id){
  chosen=classes.some(c=>c.id===id)?id:"";
  select.value=chosen;
  const uri=new URL(location.href);
  chosen?uri.searchParams.set("class",chosen):uri.searchParams.delete("class");
  history.replaceState({},"",uri);
  renderCourses();
 }
 select.addEventListener("change",()=>chooseClass(select.value));
 $("home-search").addEventListener("input",event=>{search=event.target.value.trim().toLocaleLowerCase("vi");renderCourses();renderClasses();});
 document.addEventListener("click",event=>{const b=event.target.closest("[data-filter-class]");if(!b)return;chooseClass(b.dataset.filterClass);$("courses").scrollIntoView({behavior:"smooth"});});
 renderCourses();renderClasses();
})();
