import type { PresentationLesson, PresentationSlide, PresentationBlock } from "../types";

/** Reusable classroom slide authoring, with explanations stored in presenter notes. */
type Pair = readonly [string, string];
const steps = (items: Pair[]) => items.map(([title,text])=>({title,text}));
const make = (id:string,title:string,layout:PresentationSlide["layout"],blocks:PresentationBlock[],notes:string,eyebrow="KIẾN THỨC"):PresentationSlide => ({
  id,title,layout,eyebrow,blocks,notes,
});
export const B = {
  cover(id:string,title:string,goals:[string,string,string],notes:string) {
    return make(id,title,"cover",[{type:"heroStats",items:goals.map((goal,i)=>[String(i+1).padStart(2,"0"),goal])}],notes,"CHỦ ĐỀ / MỤC TIÊU");
  },
  concepts(id:string,title:string,left:Pair,right:Pair,notes:string) {
    return make(id,title,"comparison",[
      {type:"definition",label:"NỘI DUNG 1",title:left[0],text:left[1]},
      {type:"definition",label:"NỘI DUNG 2",title:right[0],text:right[1]}
    ],notes);
  },
  cards(id:string,title:string,items:Pair[],notes:string) {
    if(items.length<2||items.length>4) throw Error("Cards require two to four ideas: "+id);
    const layout = items.length===2?"grid-2":items.length===3?"grid-3":"grid-4";
    return make(id,title,layout,items.map(([heading,text],i)=>({type:"card",number:String(i+1).padStart(2,"0"),title:heading,text})),notes);
  },
  steps(id:string,title:string,items:Pair[],notes:string) {
    return make(id,title,"steps",[{type:"steps",items:steps(items)}],notes,"THAO TÁC");
  },
  document(id:string,title:string,heading:string,paragraphs:string[],ideas:Pair[],notes:string) {
    return make(id,title,"split",[
      {type:"document",heading,paragraphs},
      {type:"stack",items:ideas.map(([title,text])=>({type:"item",title,text}))}
    ],notes,"VÍ DỤ WORD");
  },
  table(id:string,title:string,headers:string[],rows:string[][],ideas:Pair[],notes:string) {
    return make(id,title,"split",[
      {type:"excelTable",name:"BẢNG TÍNH MINH HỌA",headers,rows},
      {type:"stack",items:ideas.map(([title,text])=>({type:"item",title,text}))}
    ],notes,"VÍ DỤ EXCEL");
  },
  formula(id:string,title:string,value:string,explanation:string,notes:string) {
    return make(id,title,"full",[{type:"formula",value,explanation}],notes,"CÔNG THỨC THỰC HÀNH");
  },
  formulas(id:string,title:string,first:Pair,second:Pair,notes:string) {
    return make(id,title,"grid-2",[
      {type:"formula",value:first[0],explanation:first[1]},
      {type:"formula",value:second[0],explanation:second[1]}
    ],notes,"VÍ DỤ CÔNG THỨC");
  },
  shortcut(id:string,title:string,shortcuts:Pair[],notes:string) {
    if(shortcuts.length<2||shortcuts.length>4)throw Error("Shortcuts require 2-4 ideas: "+id);
    return make(id,title,shortcuts.length===2?"grid-2":shortcuts.length===3?"grid-3":"grid-4",
      shortcuts.map(([combo,label])=>({type:"shortcut",combo,label})),notes,"PHÍM TẮT");
  },
  quiz(id:string,question:string,answers:[string,string,string,string],correctIndex:number,explanation:string,notes="Cho học viên chọn đáp án trước khi giải thích.") {
    return make(id,question,"quiz",[{type:"quiz",answers,correctIndex,explanation}],notes,"CÂU HỎI ÔN TẬP");
  },
  practice(id:string,title:string,items:Pair[],result:string,notes:string) {
    return make(id,title,"steps",[
      {type:"steps",items:steps(items)},
      {type:"notice",text:"Sản phẩm cần đạt: "+result}
    ],notes,"THỰC HÀNH");
  },
  summary(id:string,title:string,items:Pair[],notes:string) {
    if(items.length!==3)throw Error("Summary must have 3 key points: "+id);
    return make(id,title,"summary",items.map(([heading,text],i)=>({type:"card",number:String(i+1).padStart(2,"0"),title:heading,text})),notes,"TỔNG KẾT");
  },
};
export function moduleLesson(id:string,title:string,subtitle:string,slides:PresentationSlide[],sections?:{label:string;start:number}[]):PresentationLesson {
  if(slides.length<12)throw Error("Too few slides: "+id);
  const last=slides.length-1;
  if(slides[0].layout!=="cover"||slides[last].layout!=="summary")throw Error("Missing cover or summary: "+id);
  return {
    id,title,label:title,subtitle,kind:"lesson",
    phases:[{label:"Mở đầu",start:0},{label:"Thân bài",start:1},{label:"Kết luận",start:last}],
    sections:sections??[{label:"Mở đầu",start:0},{label:"Nội dung và thực hành",start:1},{label:"Tổng kết",start:last}],
    slides
  };
}
