import {renderComponent,htmlEscape} from './components.js';
import {normalizeLayout} from './layouts.js';
export function renderSlide(slide,index){
 const layout=normalizeLayout(slide.layout);
 const isCover=layout==='cover';
 const key=slide.id||`slide-${index}`;
 const head=isCover?`<div class="cover-heading"><p class="slide-eyebrow">${htmlEscape(slide.eyebrow||'')}</p><h1>${htmlEscape(slide.title)}</h1><p class="cover-subtitle">${htmlEscape(slide.subtitle||'')}</p></div>`:
 `<header class="content-head"><p class="slide-eyebrow">${htmlEscape(slide.eyebrow||'')}</p><h2>${htmlEscape(slide.title)}</h2>${slide.subtitle?`<p class="slide-subtitle">${htmlEscape(slide.subtitle)}</p>`:''}</header>`;
 const blocks=(slide.blocks||[]).map((b,i)=>`<div class="slide-block block-${htmlEscape(b.type)} ${b.span==='all'?'span-all':Number.isInteger(b.span)?'span-'+Math.min(4,Math.max(1,b.span)):''} ${b.variant?'variant-'+htmlEscape(b.variant):''}" ${b.reveal?'data-reveal="pending"':''}>${renderComponent(b,{key:`${key}-${i}`})}</div>`).join('');
 return `<section id="slide-${index+1}" class="slide ${isCover?'slide-cover':''}" data-index="${index}" data-layout="${layout}" aria-label="Trang ${index+1}: ${htmlEscape(slide.title)}"><div class="slide-inner">${head}<div class="slide-grid layout-${layout}">${blocks}</div></div></section>`;
}
