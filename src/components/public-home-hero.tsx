"use client";

import {useEffect,useState} from "react";
import {Check,ClipboardCheck,FileText,Presentation,Play} from "lucide-react";

const scenes=[
 {name:"Word Lab",caption:"Soạn thảo văn bản"},
 {name:"Trình chiếu",caption:"Học bằng hình ảnh"},
 {name:"Quiz",caption:"Kiểm tra kiến thức"}
] as const;

function WordArtwork(){
 return <div className="xcn-visual-art xcn-visual-word" aria-hidden="true">
  <div className="xcn-visual-paper-back"/>
  <div className="xcn-visual-paper">
   <div className="xcn-visual-paper-top"><FileText size={17}/><span>Tài liệu thực hành</span><strong>DOC</strong></div>
   <h3>KẾ HOẠCH HỌC TẬP</h3>
   <p>Bài thực hành soạn thảo văn bản</p>
   <div className="xcn-visual-text-line w95"/><div className="xcn-visual-text-line w78"/>
   <div className="xcn-visual-text-line w90"/><div className="xcn-visual-text-line w62"/>
   <div className="xcn-visual-paper-highlight"><Check size={15}/> Định dạng đã áp dụng</div>
   <div className="xcn-visual-text-line w90"/><div className="xcn-visual-text-line w72"/>
  </div>
  <div className="xcn-visual-float xcn-visual-float-word"><span>Word Lab</span><strong>Học bằng thao tác</strong><small>Văn bản trên trang A4</small></div>
 </div>;
}
function SlidesArtwork(){
 return <div className="xcn-visual-art xcn-visual-slides" aria-hidden="true">
  <div className="xcn-visual-slide-back"/>
  <div className="xcn-visual-slide">
   <div className="xcn-visual-slide-top"><span>BÀI HỌC TIN HỌC</span><Presentation size={21}/></div>
   <strong>Hiểu công nghệ<br/>qua từng bài học.</strong>
   <div className="xcn-visual-slide-picture"><div/><div/><div/></div>
   <div className="xcn-visual-slide-progress"><span/><span/><span/></div>
  </div>
  <div className="xcn-visual-float xcn-visual-float-slides"><Play size={16} fill="currentColor"/><span>Thư viện trình chiếu</span></div>
 </div>;
}
function QuizArtwork(){
 return <div className="xcn-visual-art xcn-visual-quiz" aria-hidden="true">
  <div className="xcn-visual-quiz-back"/>
  <div className="xcn-visual-quiz-paper">
   <div className="xcn-visual-quiz-top"><span>TRẮC NGHIỆM</span><ClipboardCheck size={21}/></div>
   <h3>Phím tắt nào dùng<br/>để lưu văn bản?</h3>
   <div className="xcn-visual-answer">Ctrl + P</div>
   <div className="xcn-visual-answer xcn-visual-answer-correct"><span>Ctrl + S</span><Check size={17}/></div>
   <div className="xcn-visual-answer">Ctrl + A</div>
   <p>Luyện tập và nhận phản hồi</p>
  </div>
  <div className="xcn-visual-float xcn-visual-float-quiz"><Check size={17}/><span>Đáp án chính xác</span></div>
 </div>;
}

export function PublicHomeHero(){
 const [active,setActive]=useState(0);
 const [paused,setPaused]=useState(false);
 useEffect(()=>{
  if(paused||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const timer=window.setInterval(()=>setActive(current=>(current+1)%scenes.length),5200);
  return ()=>window.clearInterval(timer);
 },[paused]);
 const scene=scenes[active];
 return <div className="xcn-hero-showcase" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
  onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setPaused(false);}}>
  <div className="xcn-hero-showcase-stage" aria-label={scene.caption}>
   <div className="xcn-hero-stage-orbit" aria-hidden="true"/>
   <div className="xcn-hero-animated-scene" key={active}>
    {active===0?<WordArtwork/>:active===1?<SlidesArtwork/>:<QuizArtwork/>}
   </div>
  </div>
  <div className="xcn-hero-showcase-bottom">
   <div className="xcn-hero-scene-copy"><strong>{scene.name}</strong><span>{scene.caption}</span></div>
   <div className="xcn-hero-scene-controls" role="group" aria-label="Chọn hình minh họa">
    {scenes.map((item,index)=><button type="button" key={item.name} aria-label={`Xem minh họa ${item.name}`}
      aria-pressed={index===active} onClick={()=>setActive(index)}>
      <span className="xcn-hero-scene-progress" aria-hidden="true"/>
    </button>)}
   </div>
  </div>
 </div>;
}
