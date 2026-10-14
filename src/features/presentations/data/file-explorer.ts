// @ts-nocheck
// Imported lesson content; migration to strictly typed authoring is planned.
/*
 * Phần 1 — Quản lý tệp và thư mục (nội dung dùng chung cho nhiều lớp).
 * Each slide is data only: layout + reusable blocks. No per-slide HTML/CSS.
 * Source: the existing 29-slide HTML presentation, aligned to the supplied Windows lecture.
 */
const card=(title,text,extra={})=>({type:'card',title,text,...extra});
const key=(combo,label,detail='')=>({type:'shortcut',combo,label,detail});
const bullet=(title,text='')=>({type:'item',title,text});
const step=(title,text)=>({type:'step',title,text});
const note=(text,tone='info')=>({type:'notice',text,tone});
const q=(id,question,answers,correctIndex,explanation)=>({
  id,layout:'quiz',eyebrow:'CÂU HỎI ÔN TẬP',title:question,
  blocks:[{type:'quiz',answers,correctIndex,explanation}],
  notes:'Cho học viên chọn A/B/C/D qua khung chat trước khi bấm đáp án. Giải thích sau khi đã có câu trả lời.'
});

export const fileExplorerLesson={
  id:'quan-ly-tep-va-thu-muc',
  title:'Quản lý tệp và thư mục',
  subtitle:'Tìm kiếm, tổ chức và thao tác với File Explorer',
  label:'Phần 1',
  phases:[
    {label:'Mở đầu',start:0},
    {label:'Thân bài',start:4},
    {label:'Kết luận',start:28}
  ],
  sections:[
    {label:'Khởi động',start:0}, {label:'Tệp & thư mục',start:3},
    {label:'File Explorer',start:7}, {label:'Thao tác',start:14},
    {label:'Lưu & nộp bài',start:21}
  ],
  slides:[
    {id:'cover',layout:'cover',eyebrow:'PHẦN 1 · FILE EXPLORER',title:'Làm quen với File Explorer',blocks:[
      {type:'lessonCover',
        eyebrow:'TIN HỌC CƠ BẢN / PHẦN 1',
        heading:'Làm quen với File Explorer',
        goals:[
          {verb:'Nhận diện',detail:'Giao diện và các khu vực chính.'},
          {verb:'Thao tác',detail:'Tạo, đổi tên, sao chép, di chuyển và xóa tệp.'},
          {verb:'Tổ chức',detail:'Sắp xếp dữ liệu gọn, dễ tìm lại.'}
        ]
      }
    ],notes:'Giới thiệu trực quan cửa sổ File Explorer: thanh địa chỉ, ngăn điều hướng và danh sách tệp. Nêu ba kết quả học tập; dành câu hỏi và tình huống tìm tệp cho slide Khởi động số 02.'},
    {id:'warm-up',layout:'comparison',eyebrow:'KHỞI ĐỘNG',title:'Máy tính của em đang ngăn nắp?',subtitle:'Một tình huống thường gặp khi học và làm việc.',blocks:[
      {type:'warmUpComparison',
        messyHeading:'TỆP BỪA BỘN',
        messyText:'Tìm mãi không thấy bài tập.',
        tidyHeading:'THƯ MỤC NGĂN NẮP',
        tidyText:'Mở đúng thư mục, thấy đúng tệp.',
        prompt:'Máy tính của em đang giống bên nào hơn?',
        discussion:'Làm thế nào tìm lại ảnh hoặc bài văn đã lưu thật nhanh?',
        revealLabel:'Hiện cách sắp xếp'
      }
    ],notes:'Bước 1: Chỉ cho học viên quan sát màn hình Desktop lộn xộn ở cột trái. Đặt câu hỏi: Tìm lại bài tập Word như thế nào? Bước 2: Bấm nút “Hiện cách sắp xếp” để minh họa tệp nằm trong thư mục rõ ràng ở cột phải. Bước 3: Mời học viên chọn bên trái/bên phải và liên hệ File Explorer. Thời gian tìm tệp phụ thuộc cách tổ chức và công cụ tìm kiếm; không khẳng định số giây cố định.'},
    {id:'goals',layout:'grid-4',eyebrow:'MỤC TIÊU',title:'4 kỹ năng cần nắm vững',subtitle:'Nền tảng để thực hành Word và Excel trong quá trình thực hành.',blocks:[
      card('Hiểu cấu trúc dữ liệu','Tệp, thư mục và đường dẫn.',{number:'01',icon:'folder'}),
      card('Thao tác với tệp','Tạo, sửa tên, sao chép, di chuyển.',{number:'02',icon:'copy'}),
      card('Tìm đúng tài liệu','Dùng File Explorer và Downloads.',{number:'03',icon:'search'}),
      card('Lưu và nộp bài','Đúng tên, nơi lưu, định dạng.',{number:'04',icon:'check'})
    ],notes:'Mục tiêu đầy đủ: phân biệt tệp, thư mục, phần mở rộng, đường dẫn; tạo, đổi tên, sao chép, di chuyển, xóa và khôi phục; biết tìm tài liệu qua File Explorer/Downloads; lưu Word–Excel đúng tên, vị trí, định dạng.'},
    {id:'file-vs-folder',layout:'grid-2',eyebrow:'KHÁI NIỆM CƠ BẢN',title:'Tệp và thư mục',subtitle:'Hai khái niệm quan trọng để tổ chức dữ liệu.',blocks:[
      {type:'definition',icon:'file',label:'FILE',title:'Tệp tin',text:'Dữ liệu được lưu thành một tệp có tên riêng.',example:'Bang_diem.xlsx'},
      {type:'definition',icon:'folder',label:'FOLDER',title:'Thư mục',text:'Nơi chứa và sắp xếp các tệp hoặc thư mục con.',example:'ON_TAP_TIN_HOC'},
      note('Tệp chứa dữ liệu. Thư mục giúp tổ chức dữ liệu.')
    ]},
    {id:'file-formats',layout:'grid-4',eyebrow:'KHÁI NIỆM CƠ BẢN',title:'Nhận biết các loại tệp',subtitle:'Phần mở rộng thường cho biết dạng nội dung của tệp.',blocks:[
      {type:'fileType',extension:'DOCX',name:'Thong_bao.docx',caption:'Văn bản Word',tone:'word'},
      {type:'fileType',extension:'XLSX',name:'Bang_diem.xlsx',caption:'Bảng tính Excel',tone:'excel'},
      {type:'fileType',extension:'PDF',name:'De_thi.pdf',caption:'Tài liệu PDF',tone:'pdf'},
      {type:'fileType',extension:'JPG',name:'Anh_lop.jpg',caption:'Tệp hình ảnh',tone:'image'}
    ]},
    {id:'filename',layout:'split',eyebrow:'TÊN TỆP & PHẦN MỞ RỘNG',title:'Cách đọc tên tệp',subtitle:'Không tự ý đổi phần mở rộng để chuyển định dạng.',blocks:[
      {type:'filename',name:'Bang_diem',extension:'.xlsx'},
      {type:'stack',items:[bullet('.docx → Word','Văn bản, bài soạn, thông báo.'),bullet('.xlsx → Excel','Bảng tính, thống kê, công thức.')]},
      {...note('Đổi “.docx” thành “.xlsx” không biến tài liệu Word thành bảng tính Excel.','warning'),reveal:true}
    ]},
    q('quiz-file-extension','Tệp nào được mở bằng Microsoft Excel?',['Bao_cao.docx','Bang_diem.xlsx','De_thi.pdf','Anh_lop.jpg'],1,'Tệp .xlsx là định dạng bảng tính thường dùng của Microsoft Excel.'),
    {id:'explorer-intro',layout:'split-demo',eyebrow:'FILE EXPLORER',title:'Làm quen với File Explorer',subtitle:'Công cụ mở, tìm kiếm và quản lý tệp trên Windows.',blocks:[
      {type:'explorer',initial:'Documents',folders:[
        {name:'Documents',files:[['De_01.docx','Word'],['Bang_diem.xlsx','Excel']]},
        {name:'Downloads',files:[['De_thi.pdf','PDF']]},
        {name:'Desktop',files:[['Bai_tap.docx','Word']]}
      ]},
      {type:'stack',items:[bullet('Thanh địa chỉ','Cho biết thư mục đang mở.'),bullet('Ngăn điều hướng','Chuyển tới Desktop, Downloads, Documents.'),bullet('Vùng nội dung','Hiển thị các tệp và thư mục con.')]}
    ]},
    {id:'open-explorer',layout:'focus',eyebrow:'FILE EXPLORER',title:'Mở File Explorer',subtitle:'Tổ hợp phím nhanh nhất: Windows + E.',blocks:[
      {type:'keyCombo',keys:['Win','+','E'],caption:'MỞ FILE EXPLORER'},
      note('Cách khác: nhấn biểu tượng thư mục trên thanh tác vụ hoặc tìm “File Explorer” trong Start.')
    ]},
    {id:'explorer-zones',layout:'wide-demo',eyebrow:'GIAO DIỆN FILE EXPLORER',title:'Ba khu vực chính',subtitle:'Thanh đường dẫn · Ngăn điều hướng · Khu vực tệp.',blocks:[
      {type:'explorer',initial:'Documents',folders:[
        {name:'Documents',files:[['Word','Thư mục'],['Excel','Thư mục'],['De_01.docx','Word']]},
        {name:'Downloads',files:[['Bai_mau.pdf','PDF']]},
        {name:'Desktop',files:[['Lich_hoc.pdf','PDF']]}
      ]},
      {type:'stack',items:[bullet('01 · Thanh địa chỉ','Thư mục hiện đang mở.'),bullet('02 · Ngăn điều hướng','Truy cập nhanh các vị trí lưu.'),bullet('03 · Danh sách tệp','Tài liệu và thư mục con.')]}
    ]},
    {id:'locations',layout:'grid-3',eyebrow:'VỊ TRÍ LƯU THƯỜNG GẶP',title:'Tệp thường được lưu ở đâu?',subtitle:'Ba vị trí thường dùng trong Windows.',blocks:[
      card('Desktop','Màn hình nền; tệp và lối tắt cần truy cập nhanh.',{number:'01'}),
      card('Downloads','Tải xuống; tệp vừa tải từ trình duyệt hoặc ứng dụng.',{number:'02'}),
      card('Documents','Tài liệu; thư mục phổ biến để lưu hồ sơ học tập.',{number:'03'}),
      note('Đường dẫn có thể thay đổi theo tài khoản, cài đặt Windows và trình duyệt.')
    ]},
    {id:'path',layout:'timeline',eyebrow:'ĐƯỜNG DẪN TỆP',title:'Cách đọc đường dẫn tệp',subtitle:'Lần theo ổ đĩa, thư mục và tên tệp.',blocks:[
      {type:'code',code:'D:\\ON_TAP_TIN_HOC\\WORD\\De_01.docx',label:'VÍ DỤ ĐƯỜNG DẪN'},
      {type:'steps',items:[step('D:','Ổ đĩa'),step('ON_TAP_TIN_HOC','Thư mục chính'),step('WORD','Thư mục con'),step('De_01.docx','Tệp Word')]}
    ]},
    {id:'folder-tree',layout:'split',eyebrow:'CÂY THƯ MỤC',title:'Tổ chức thư mục học tập',subtitle:'Tạo một vị trí lưu thống nhất để dễ tìm lại bài.',blocks:[
      {type:'folderTree',nodes:[{name:'Documents',children:[{name:'ON_TAP_TIN_HOC',children:[{name:'WORD',children:[{name:'De_01.docx',file:true}]},{name:'EXCEL',children:[{name:'Bang_diem.xlsx',file:true}]},{name:'NOP_BAI'}]}]}]},
      {type:'stack',items:[bullet('Mỗi loại bài có một thư mục','Phân loại tệp Word, Excel và nơi lưu bài hoàn thành.'),bullet('Tìm bài nhanh hơn','Tổ chức một lần để sử dụng xuyên suốt khóa học.')]}
    ]},
    q('quiz-folder','Tệp “De_01.docx” nằm trong thư mục nào?',['EXCEL','NOP_BAI','WORD','Downloads'],2,'Theo cây thư mục, tệp De_01.docx nằm trong thư mục WORD.'),
    {id:'new-folder',layout:'steps',eyebrow:'TẠO THƯ MỤC MỚI',title:'Tạo thư mục mới',subtitle:'Tạo đúng vị trí, đặt tên rõ ràng.',blocks:[
      {type:'steps',items:[step('Mở đúng vị trí','Ví dụ: Documents.'),step('Nhấn Ctrl + Shift + N','Hoặc New → Folder.'),step('Đặt tên và Enter','Ví dụ: ON_TAP_TIN_HOC.')]},
      note('Người dùng máy tính thực hành tạo thư mục; người dùng điện thoại mô tả các bước.')
    ]},
    {id:'rename',layout:'comparison',eyebrow:'ĐỔI TÊN TỆP / THƯ MỤC',title:'Đổi tên tệp bằng F2',subtitle:'Tên rõ ràng giúp lưu bài và nộp bài thuận lợi.',blocks:[
      card('Trước khi đổi','Document1.docx — tên mặc định, khó nhận biết nội dung.',{number:'TRƯỚC'}),
      card('Sau khi đổi','NguyenVanA_Word.docx — biết chủ sở hữu và phần bài.',{number:'SAU'}),
      note('Chọn tệp → F2 → nhập tên → Enter. Không đổi phần mở rộng nếu không cần thiết.')
    ]},
    {id:'multiselect',layout:'grid-2',eyebrow:'CHỌN NHIỀU TỆP',title:'Chọn nhiều tệp cùng lúc',subtitle:'Phân biệt Ctrl và Shift khi chọn dữ liệu.',blocks:[
      {type:'definition',label:'KHÔNG LIÊN TIẾP',title:'Ctrl',text:'Giữ Ctrl và chọn từng tệp cần lấy.',example:'Bai1.docx + Bai3.docx'},
      {type:'definition',label:'LIÊN TIẾP',title:'Shift',text:'Chọn đầu dải, giữ Shift và chọn cuối dải.',example:'Bai1.docx → Bai5.docx'},
      note('Ví dụ: chọn Bai1.docx và Bai3.docx nhưng không chọn Bai2.docx → dùng Ctrl.')
    ]},
    {id:'copy-demo',layout:'wide-demo',eyebrow:'SAO CHÉP TỆP',title:'Sao chép: giữ nguyên bản gốc',subtitle:'Copy tạo thêm một bản tại vị trí mới.',blocks:[
      {type:'fileTransfer',mode:'copy',filename:'Bai1.docx',source:'THƯ MỤC A',destination:'THƯ MỤC B'},
      note('Ctrl + C → Ctrl + V. Bản gốc ở A vẫn còn, B có thêm một bản sao.')
    ],notes:'Bấm “Thực hiện” để mô phỏng sao chép. Hỏi học viên A có còn tệp hay không; bấm Làm lại khi cần.'},
    {id:'move-demo',layout:'wide-demo',eyebrow:'DI CHUYỂN TỆP',title:'Di chuyển: thay đổi vị trí lưu',subtitle:'Move chuyển tệp khỏi vị trí ban đầu.',blocks:[
      {type:'fileTransfer',mode:'move',filename:'Bai1.docx',source:'THƯ MỤC A',destination:'THƯ MỤC B'},
      note('Ctrl + X → Ctrl + V. Tệp được chuyển từ thư mục A sang B.')
    ],notes:'Bấm “Thực hiện” để mô phỏng di chuyển. Khác Copy: thư mục A không còn tệp.'},
    {id:'copy-vs-move',layout:'comparison',eyebrow:'SO SÁNH THAO TÁC',title:'Copy khác Move',subtitle:'Hai thao tác giống cách dán nhưng khác kết quả.',blocks:[
      {type:'definition',label:'SAO CHÉP',title:'COPY',text:'Giữ lại bản gốc.',example:'Ctrl + C → Ctrl + V'},
      {type:'definition',label:'DI CHUYỂN',title:'MOVE',text:'Thay đổi vị trí lưu.',example:'Ctrl + X → Ctrl + V'}
    ]},
    q('quiz-move','Muốn di chuyển tệp, dùng tổ hợp nào?',['Ctrl + C rồi Ctrl + V','Ctrl + X rồi Ctrl + V','F2','Ctrl + S'],1,'Ctrl + X để cắt, Ctrl + V để dán vào vị trí mới.'),
    {id:'recycle-bin',layout:'steps',eyebrow:'XÓA VÀ KHÔI PHỤC',title:'Khôi phục tệp đã xóa',subtitle:'Tệp xóa bằng Delete trên ổ đĩa cục bộ thường vào Recycle Bin.',blocks:[
      {type:'steps',items:[step('Chọn tệp','Nhấn Delete để xóa thông thường.'),step('Mở Recycle Bin','Tìm tệp đã xóa trong Thùng rác.'),step('Khôi phục','Chọn Restore để trả lại vị trí cũ.')]},
      note('Shift + Delete hoặc xóa trên một số vị trí lưu trữ có thể bỏ qua Recycle Bin.','warning')
    ]},
    {id:'downloads',layout:'steps',eyebrow:'TÌM LẠI TỆP ĐÃ TẢI',title:'Tìm tệp trong Downloads',subtitle:'Bắt đầu từ nơi trình duyệt thường lưu tài liệu tải về.',blocks:[
      {type:'steps',items:[step('Mở Downloads','Có thể mở từ thanh bên File Explorer.'),step('Tìm theo tên','Nhập một phần tên vào ô Search.'),step('Mở đúng tệp','Kiểm tra tên và phần mở rộng.')]},
      note('Nếu không thấy trong Downloads, kiểm tra danh sách tải xuống của trình duyệt để biết đường dẫn thực tế.')
    ]},
    q('quiz-download','Tệp vừa tải từ trình duyệt thường nằm ở đâu?',['Recycle Bin','Downloads','Control Panel','Windows\\System32'],1,'Mặc định phổ biến là Downloads, nhưng có thể thay đổi trong cài đặt trình duyệt.'),
    {id:'exam-workflow',layout:'timeline',eyebrow:'LƯU VÀ NỘP BÀI THỰC HÀNH',title:'5 bước làm và nộp bài Word–Excel',subtitle:'Quy trình có thể áp dụng khi làm bài kiểm tra thực hành.',blocks:[
      {type:'steps',items:[step('NHẬN ĐỀ','Tìm đúng tệp đề.'),step('MỞ TỆP','Dùng Word hoặc Excel.'),step('LÀM BÀI','Thực hiện yêu cầu.'),step('LƯU TỆP','Đúng tên, định dạng, thư mục.'),step('KIỂM TRA','Mở lại và nộp bài.')]},
      note('Trước khi nộp: phải mở lại được tệp đã lưu và kiểm tra nội dung.')
    ]},
    {id:'save-checks',layout:'grid-3',eyebrow:'TẬP THÓI QUEN LƯU BÀI',title:'Ba điều cần kiểm tra khi lưu',subtitle:'Một thao tác kiểm tra ngắn có thể tránh mất bài.',blocks:[
      card('TÊN TỆP','NguyenVanA_Word.docx — dễ xác định chủ sở hữu và phần thi.',{number:'01'}),
      card('NƠI LƯU','Documents / NOP_BAI — đúng thư mục được hướng dẫn.',{number:'02'}),
      card('ĐỊNH DẠNG','.docx / .xlsx — đúng dạng tệp theo yêu cầu.',{number:'03'})
    ]},
    q('quiz-submit','Trước khi nộp bài Word–Excel, cần làm gì?',['Đổi hình nền máy tính','Đóng mọi cửa sổ mà không lưu','Lưu đúng nơi và mở lại kiểm tra','Xóa các thư mục tạm'],2,'Kiểm tra tên, định dạng, nơi lưu và mở lại tệp trước khi nộp.'),
    {id:'shortcuts',layout:'grid-3',eyebrow:'ÔN TẬP NHANH',title:'Các phím tắt thường dùng',subtitle:'Những thao tác quan trọng nhất khi quản lý tệp và thư mục.',blocks:[
      key('Win + E','Mở File Explorer'),key('Ctrl + Shift + N','Tạo thư mục'),key('F2','Đổi tên'),
      key('Ctrl + C','Sao chép'),key('Ctrl + X','Cắt để di chuyển'),key('Ctrl + V','Dán')
    ],notes:'Ba phím bổ sung để thực hành: Delete — xóa thông thường; Ctrl + Z — hoàn tác khi được hỗ trợ; Ctrl + S — lưu trong Word/Excel. Gợi ý yêu cầu học viên luyện đủ chín phím, nhưng chỉ trình chiếu sáu phím cốt lõi để tránh quá tải.'},
    {id:'summary',layout:'grid-3',eyebrow:'TỔNG KẾT',title:'Ba nguyên tắc cần ghi nhớ',subtitle:'Nền tảng để bắt đầu thực hành Word và Excel.',blocks:[
      card('File khác Folder','Tệp chứa; thư mục sắp xếp.',{number:'01'}),
      card('Copy khác Move','Copy giữ gốc; Move chuyển vị trí.',{number:'02'}),
      card('Lưu đúng – kiểm tra lại','Đúng tên, đúng nơi, mở được.',{number:'03'}),
      note('Nội dung tiếp theo: Microsoft Word – nhập liệu và định dạng văn bản.')
    ],notes:'Mỗi học viên chọn một nguyên tắc để tóm tắt trong một câu. Giao nhiệm vụ tạo ON_TAP_TIN_HOC với WORD, EXCEL, NOP_BAI.'}
  ]
};
