/** 15 preset layouts: content may reuse any registered component within them. */
export const layouts=Object.freeze({
 cover:{label:'Mở đầu'},
 full:{label:'Nội dung toàn trang'},
 split:{label:'Hai cột'},
 'split-reverse':{label:'Hai cột đảo chiều'},
 'grid-2':{label:'Lưới 2'},
 'grid-3':{label:'Lưới 3'},
 'grid-4':{label:'Lưới 4'},
 comparison:{label:'So sánh'},
 steps:{label:'Các bước'},
 'split-demo':{label:'Mô phỏng và giải thích'},
 'wide-demo':{label:'Mô phỏng toàn chiều rộng'},
 timeline:{label:'Dòng quy trình'},
 focus:{label:'Tập trung một điểm'},
 quiz:{label:'Câu hỏi tương tác'},
 summary:{label:'Tổng kết'}
});
export function normalizeLayout(layout){return Object.hasOwn(layouts,layout)?layout:'full';}
