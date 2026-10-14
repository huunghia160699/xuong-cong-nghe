/** Reusable, data-only teaching components. No course- or slide-specific markup. */
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id=v=>esc(String(v??'').replace(/[^A-Za-z0-9_-]/g,'-'));
const icon=name=>{
 const paths={
  folder:'<path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
  file:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
  search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="1"/><path d="M16 8V4H4v12h4"/>',
  check:'<path d="m5 12 5 5L20 7"/>',
  keyboard:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h0M10 8h0M14 8h0M18 8h0M6 12h0M10 12h0M14 12h0M18 12h0M7 16h10"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 18v3h16v-3"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7"/>',
  monitor:'<rect x="3" y="3" width="18" height="14" rx="1"/><path d="M8 21h8m-4-4v4"/>'
 };
 return `<svg class="uicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]??paths.file}</svg>`;
};

function renderTree(nodes, depth=0){return `<ul class="tree-list">${(nodes||[]).map(node=>`<li><div class="tree-node" style="--tree-depth:${depth}">${icon(node.file?'file':'folder')}<span>${esc(node.name)}</span></div>${node.children?.length?renderTree(node.children,depth+1):''}</li>`).join('')}</ul>`;}

function renderRows(rows=[]){return rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('');}

export const components={
 heroStats:b=>`<div class="hero-stats">${b.items.map(([value,label])=>`<div class="hero-stat"><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`).join('')}</div>`,
 card:b=>`<article class="card ${(b.tone||'')==='accent'?'accent-card':''}">${b.number?`<div class="card-number">${esc(b.number)}</div>`:''}${b.icon?`<div class="card-icon">${icon(b.icon)}</div>`:''}<h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article>`,
 definition:b=>`<article class="definition-card">${b.icon?`<div class="definition-icon">${icon(b.icon)}</div>`:''}<div class="eyebrow">${esc(b.label||'')}</div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p>${b.example?`<div class="example">${esc(b.example)}</div>`:''}</article>`,
 fileType:b=>`<article class="filetype tone-${esc(b.tone||'neutral')}"><div class="filetype-mark">${esc(b.extension)}</div><strong>${esc(b.name)}</strong><span>${esc(b.caption||'')}</span></article>`,
 filename:b=>`<div class="filename-demo"><div class="filename-parts"><span>${esc(b.name)}</span><strong>${esc(b.extension)}</strong></div><div class="filename-labels"><span>PHẦN TÊN</span><span>PHẦN MỞ RỘNG</span></div></div>`,
 item:b=>`<div class="stack-item"><strong>${esc(b.title)}</strong>${b.text?`<p>${esc(b.text)}</p>`:''}</div>`,
 stack:b=>`<div class="stack-list">${(b.items||[]).map(child=>renderComponent(child)).join('')}</div>`,
 notice:b=>`<div class="notice notice-${esc(b.tone||'info')}">${icon(b.tone==='warning'?'trash':'check')}<p>${esc(b.text)}</p></div>`,
 shortcut:b=>`<div class="shortcut-card"><kbd>${esc(b.combo)}</kbd><div><strong>${esc(b.label)}</strong>${b.detail?`<p>${esc(b.detail)}</p>`:''}</div></div>`,
 keyCombo:b=>`<div class="big-keys"><div class="key-sequence">${(b.keys||[]).map(key=>key==='+'?'<span class="key-plus">+</span>':`<kbd>${esc(key)}</kbd>`).join('')}</div><strong>${esc(b.caption||'')}</strong></div>`,
 folderTree:b=>`<div class="folder-tree">${renderTree(b.nodes||[])}</div>`,
 code:b=>`<div class="code-card">${b.label?`<div class="eyebrow">${esc(b.label)}</div>`:''}<code>${esc(b.code)}</code></div>`,
 steps:b=>`<div class="step-list">${(b.items||[]).map((step,i)=>`<div class="step-row"><span class="step-number">${String(i+1).padStart(2,'0')}</span><div><strong>${esc(step.title)}</strong><p>${esc(step.text)}</p></div></div>`).join('')}</div>`,
 explorer:(b,context)=>`<div class="explorer-sim" data-interaction="explorer" data-key="${id(context.key)}"><div class="explorer-titlebar"><span class="explorer-app">${icon('folder')} File Explorer</span><span aria-hidden="true">— &nbsp; □ &nbsp; ×</span></div><div class="explorer-toolbar"><span>← &nbsp; → &nbsp; ↑</span><span class="explorer-path" data-explorer-path>${esc(b.initial||b.folders[0]?.name)}</span><span class="explorer-search">⌕ Search</span></div><div class="explorer-content"><nav class="explorer-sidebar" aria-label="Thư mục">${(b.folders||[]).map((f,i)=>`<button type="button" data-explorer-folder="${i}" class="explorer-folder ${f.name===b.initial?'selected':''}">${icon('folder')}${esc(f.name)}</button>`).join('')}</nav><div class="explorer-files" data-explorer-files>${renderFileTiles(b.folders.find(f=>f.name===b.initial)||b.folders[0])}</div></div></div>`,
 fileTransfer:(b,context)=>`<div class="transfer" data-interaction="transfer" data-mode="${esc(b.mode)}" data-filename="${esc(b.filename)}" data-key="${id(context.key)}"><div class="transfer-sides"><div class="transfer-panel"><h3>📁 ${esc(b.source)}</h3><div data-transfer-source class="transfer-file">${icon('file')} ${esc(b.filename)}</div></div><div class="transfer-arrow">→</div><div class="transfer-panel"><h3>📁 ${esc(b.destination)}</h3><div data-transfer-destination class="transfer-placeholder">Chưa có tệp</div></div></div><div class="transfer-actions"><button type="button" class="action-primary" data-transfer-run>THỰC HIỆN</button><button type="button" class="action-secondary" data-transfer-reset>LÀM LẠI</button></div></div>`,
 quiz:(b,context)=>`<div class="quiz" data-interaction="quiz" data-correct="${Number(b.correctIndex)}" data-explanation="${esc(b.explanation)}" data-key="${id(context.key)}"><div class="quiz-options">${(b.answers||[]).map((ans,i)=>`<button type="button" class="quiz-option" data-answer="${i}"><span class="option-letter">${'ABCD'[i]}</span><span>${esc(ans)}</span></button>`).join('')}</div><div class="quiz-feedback" aria-live="polite" hidden><strong></strong><p></p><button type="button" data-quiz-reset>Thử lại</button></div></div>`,
 formula:b=>`<div class="formula-block"><span class="eyebrow">${esc(b.label||'CÔNG THỨC EXCEL')}</span><code>${esc(b.value)}</code>${b.explanation?`<p>${esc(b.explanation)}</p>`:''}</div>`,
 excelTable:b=>`<div class="excel-table-wrap"><div class="excel-name">${esc(b.name||'Bảng tính')}</div><table class="excel-table"><thead><tr>${(b.headers||[]).map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${renderRows(b.rows)}</tbody></table>${b.highlight?`<p class="excel-highlight">Ô trọng tâm: ${esc(b.highlight)}</p>`:''}</div>`,
 document:b=>`<div class="document-preview"><div class="document-menu">Microsoft Word <span>— &nbsp; □ &nbsp; ×</span></div><div class="document-sheet"><h3>${esc(b.heading)}</h3>${(b.paragraphs||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div></div>`,
 image:b=>`<figure class="image-block"><img src="${esc(b.src)}" alt="${esc(b.alt||'')}" loading="lazy"/>${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`,
 compare:b=>`<div class="compare-component"><div><span class="eyebrow">${esc(b.left?.label||'PHƯƠNG ÁN A')}</span><h3>${esc(b.left?.title)}</h3><p>${esc(b.left?.text)}</p></div><div><span class="eyebrow">${esc(b.right?.label||'PHƯƠNG ÁN B')}</span><h3>${esc(b.right?.title)}</h3><p>${esc(b.right?.text)}</p></div></div>`,
 hotspot:b=>`<div class="hotspot-panel" data-interaction="hotspot">${b.title?`<strong>${esc(b.title)}</strong>`:''}<div class="hotspot-points">${(b.points||[]).map((p,i)=>`<button type="button" data-hotspot="${i}" data-hotspot-text="${esc(p.explanation)}">${esc(p.label)}</button>`).join('')}</div><div class="hotspot-result" data-hotspot-result aria-live="polite">Nhấn một khu vực để xem giải thích</div></div>`
};
function renderFileTiles(folder){return (folder?.files||[]).map(([name,kind])=>`<div class="explorer-file">${icon(kind==='Thư mục'?'folder':'file')}<span>${esc(name)}</span><small>${esc(kind)}</small></div>`).join('');}
export function renderComponent(block,context={}){const fn=components[block?.type];if(!fn)return `<div class="component-error">Chưa hỗ trợ component: ${esc(block?.type)}</div>`;return fn(block,context);}
export const countComponents=()=>Object.keys(components).length;
export const htmlEscape=esc;
export {renderFileTiles};
