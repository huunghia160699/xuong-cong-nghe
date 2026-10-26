/** Roadmap is a proposal and a work log, never proof that a feature was deployed. */
export type RoadmapStatus="planned"|"analysis"|"design"|"building"|"testing"|"done"|"paused";
export type RoadmapPriority="P0"|"P1"|"P2"|"P3";
export type RoadmapEntryKind="note"|"added"|"fixed";
export type RoadmapChecklistItem={id:string;text:string;done:boolean};
export type RoadmapEntry={id:string;kind:RoadmapEntryKind;text:string;date:string};
export type RoadmapEpic={
 id:string;title:string;summary:string;phase:string;area:string;
 priority:RoadmapPriority;status:RoadmapStatus;order:number;
 checklist:RoadmapChecklistItem[];entries:RoadmapEntry[];
 updatedAt?:string;
};
export const ROADMAP_STATUS:Record<RoadmapStatus,string>={
 planned:"Chưa làm",analysis:"Đang phân tích",design:"Đang thiết kế",
 building:"Đang phát triển",testing:"Đang kiểm thử",done:"Hoàn thành",paused:"Tạm hoãn"
};
export const ROADMAP_PRIORITY:Record<RoadmapPriority,string>={
 P0:"Nền tảng bắt buộc",P1:"Lõi giáo dục",P2:"Tin học thực hành",P3:"Mở rộng"
};
export const ROADMAP_PHASES=[
 "00 · Nền tảng & Admin","01 · Website & Tài khoản",
 "02 · Giáo viên & Học sinh","03 · Câu hỏi, Đề thi & Live",
 "04 · Tin học thực hành","05 · Nội dung & Khóa học","06 · Vận hành & Mở rộng"
] as const;

type Seed={id:string;title:string;summary:string;phase:number;priority:RoadmapPriority;
 status?:RoadmapStatus;area:string;tasks:string[];completed?:number[];
 notes?:{kind:RoadmapEntryKind;text:string;date:string}[]};
const SEEDS:Seed[]=[
 {id:"admin-center",title:"Trung tâm quản trị toàn website",summary:"Dashboard điều hành, điều hướng module, báo cáo hệ thống và quyền admin.",phase:0,priority:"P0",area:"Quản trị",status:"building",
 tasks:["Dashboard tổng quan thực/được ghi nhãn demo","Sidebar quản trị phân nhóm đúng các trang đã có","Roadmap dọc có lọc, tìm kiếm, checklist và nhật ký","Tạo/sửa/xóa nhiệm vụ lớn, nhiệm vụ nhỏ và ghi chú","Lưu roadmap an toàn, xuất Markdown/JSON và nhập sao lưu","Xác minh quyền admin, RLS và kiểm thử đa tài khoản","Kiểm thử trực quan mobile/tablet/desktop và Production"],
 completed:[0],
 notes:[{kind:"note",text:"Ưu tiên hoàn thành Admin + Roadmap trước các phân hệ giáo dục khác.",date:"2026-10-26"}]},
 {id:"system-architecture",title:"Kiến trúc, dữ liệu và bảo mật",summary:"Kiểm kê hệ thống, chuẩn schema, quyền, môi trường và vận hành.",phase:0,priority:"P0",area:"Hệ thống",
 tasks:["Kiểm kê module/routes đã có và tình trạng vận hành","Khóa mô hình quyền khách/học sinh/giáo viên/trường/admin","Thiết lập Dev, Preview, Production và migration an toàn","Kiểm tra RLS chống đọc/sửa dữ liệu chéo","Thiết lập backup, restore, audit logs và giám sát","Kiểm thử tải, bảo mật API và khả năng khôi phục dữ liệu"]},
 {id:"design-system",title:"Thiết kế chung & trải nghiệm responsive",summary:"Hệ token, header, cards, typography và UI cho máy tính/điện thoại.",phase:0,priority:"P0",area:"Giao diện",
 tasks:["Thống nhất navy/blue/cyan/ice và hệ spacing","Chuẩn header, footer, sidebar, thành phần form","Xây trạng thái loading/empty/error và keyboard focus","Xây các layout theo vai trò, không ép chiều cao mobile","Kiểm thử 360/768/1280px và WCAG cơ bản"]},
 {id:"public-landing",title:"Landing Page & điều hướng công khai",summary:"Khám phá hệ sinh thái, giới thiệu sản phẩm và nút truy cập nhanh.",phase:1,priority:"P0",area:"Website",
 tasks:["Hero giới thiệu Xưởng Công Nghệ và CTA theo đối tượng","Header Giáo viên/Học sinh/Công cụ/Thực hành/Thư viện/Trò chơi","Hiển thị tên, ảnh đại diện và menu tài khoản khi đã đăng nhập","Tham gia phòng bằng mã từ header","Section Tin học và bản demo thực hành nổi bật","FAQ, hỗ trợ, chính sách, footer và tìm kiếm","Điều hướng mobile và phân tích sự kiện tương tác"]},
 {id:"auth-account",title:"Đăng nhập, đăng ký và hồ sơ đa vai trò",summary:"Một danh tính, nhiều quyền hợp lệ, onboarding riêng từng người dùng.",phase:1,priority:"P0",area:"Tài khoản",
 tasks:["Đăng nhập/đăng ký/quên mật khẩu/xác minh email","Chọn mục đích tham gia khi đăng ký, không tự cấp quyền admin","Onboarding học sinh, giáo viên và người học tự do","Hồ sơ cá nhân và ảnh đại diện","Chuyển không gian làm việc khi tài khoản có nhiều quyền","Bảo vệ tài khoản HS, quyền riêng tư và kiểm soát phiên"],
 completed:[0],notes:[{kind:"note",text:"Repository đã có các route xác thực cơ bản; onboarding theo vai trò vẫn cần kiểm chứng.",date:"2026-10-26"}]},
 {id:"teacher-workspace",title:"Teacher Studio & quản lý lớp",summary:"Không gian giáo viên: lớp, sổ học sinh, hoạt động và thông báo.",phase:2,priority:"P0",area:"Giáo viên",
 tasks:["Dashboard công việc & lớp gần đây","Tạo/chỉnh sửa/lưu trữ lớp, năm học và môn","Import danh sách HS từ CSV/Excel, kiểm tra trùng","Mời/xác thực học sinh, nhóm và phân quyền lớp","Xem bài cần chấm, hoạt động sắp tới, thông báo","Báo cáo kết quả và xuất sổ lớp"]},
 {id:"student-hub",title:"Student Hub & tiến độ cá nhân",summary:"Không gian học tập mobile-first cho HS theo lớp hoặc tự học.",phase:2,priority:"P1",area:"Học sinh",
 tasks:["Dashboard bài đang học/bài được giao/lớp của em","Tham gia lớp bằng mã, hồ sơ học sinh và quyền dữ liệu","Vào nhanh Live Quiz, làm bài trên điện thoại","Lưu tiến độ, bài dở và xem kết quả khi được phép","Luyện câu sai, thành tích và khuyến nghị học lại"],
 notes:[{kind:"note",text:"Đã có màn Student/Quiz cơ bản trong repository, chưa phải Student Hub hoàn chỉnh.",date:"2026-10-26"}]},
 {id:"question-bank",title:"Ngân hàng câu hỏi dùng chung",summary:"Một câu hỏi sử dụng lại cho bài giảng, đề, live và luyện tập.",phase:3,priority:"P0",area:"Đánh giá",
 tasks:["Mô hình môn/khối/phần/chủ đề/độ khó/kỹ năng","Soạn A/B/C/D, nhiều đáp án, đúng-sai và điền ngắn","Version, nháp/duyệt/xuất bản và khóa bản đã giao","Tìm kiếm, lọc, nhân bản, nhập Word/CSV có rà soát","Gắn câu hỏi vào bài giảng, đề, trò chơi và luyện tập","Quản lý media, công thức, giải thích và đáp án"]},
 {id:"exams-assignments",title:"Đề kiểm tra, giao bài và chấm",summary:"Ra đề, giao lớp, nộp trên thiết bị, chấm tự động và báo cáo.",phase:3,priority:"P1",area:"Đánh giá",
 tasks:["Tạo đề từ ngân hàng và thiết lập thời gian/điểm","Trộn câu/đáp án, ma trận/đặc tả theo yêu cầu","Giao lớp, link/mã, mở/đóng và số lượt làm","Autosave bài làm server, reconnect và nộp đúng hạn","Chấm server, chấm tự luận và quy trình chấm lại","Thống kê câu sai, điểm theo lớp và xuất CSV/Excel"]},
 {id:"live-quiz",title:"Live Quiz — học sinh nhập mã phòng",summary:"Giáo viên điều khiển trên máy tính, học sinh trả lời trên điện thoại.",phase:3,priority:"P1",area:"Tương tác",
 tasks:["Tạo phòng PIN 6 chữ số, URL/QR và phòng chờ","Học sinh nhập tên/chọn hồ sơ, quản lý tên trùng","Host, màn trình chiếu, giao diện điện thoại","Bắt đầu/tạm dừng/đếm giờ/khóa/công bố/chuyển câu","Nhận câu trả lời realtime, chống gửi trùng và reconnect","Biểu đồ A/B/C/D, báo cáo theo HS/câu và lưu lịch sử","Pilot 45–50 thiết bị, quyền riêng tư và đo độ trễ"]},
 {id:"word-lab",title:"Word Lab — mô phỏng và thực hành",summary:"Nâng editor hiện tại thành bài thực hành có kiểm tra và nộp kết quả.",phase:4,priority:"P2",area:"Tin học",status:"building",
 tasks:["Mô phỏng Word: nhập liệu và định dạng văn bản","Ribbon, giãn dòng/đoạn, dấu ¶ và phân trang ổn định","Bảng, hình ảnh, bố cục, in và lưu bản nháp","Bộ nhiệm vụ Word theo kỹ năng và độ khó","Chấm theo tiêu chí kết quả, không so pixel","Lưu bài làm/nộp bài/báo cáo lớp"],
 completed:[0,1],
 notes:[{kind:"fixed",text:"Đã sửa giãn dòng, giãn đoạn và làm menu Line Spacing HTML tùy chỉnh.",date:"2026-10-26"},{kind:"added",text:"Mô phỏng Word có trình soạn và phân trang; cần test lại trên trình duyệt thật.",date:"2026-10-26"}]},
 {id:"excel-lab",title:"Excel Lab — bảng tính tương tác",summary:"Thực hành ô, công thức, hàm, bảng và biểu đồ trên trình duyệt.",phase:4,priority:"P2",area:"Tin học",
 tasks:["Thiết kế bảng tính tương tác và dữ liệu mẫu","Hàm cơ bản/điều kiện, địa chỉ ô, lỗi công thức","Sắp xếp, lọc, bảng và biểu đồ","Bài thực hành có test cases và gợi ý","Chấm kết quả, lưu bài, nộp và tiến độ lớp"]},
 {id:"presentation-lab",title:"PowerPoint & trình chiếu bài giảng",summary:"Tận dụng player React có sẵn rồi bổ sung editor và tương tác.",phase:4,priority:"P2",area:"Tin học",status:"building",
 tasks:["Trình chiếu React/catalog bài Tin học","Quản lý phần/chủ đề/bài, nhập lớp khi trình chiếu","Editor slide: layout, text, hình, bảng và ghi chú","Chèn câu hỏi ngân hàng và mở Live Quiz từ slide","Lưu phiên bản, chia sẻ, trình chiếu toàn màn hình","Bài thực hành PowerPoint và tiêu chí chấm"],
 completed:[0],notes:[{kind:"added",text:"Repository có trình chiếu React với catalog Tin học, Word, Excel; chưa có trình soạn thảo slide.",date:"2026-10-26"}]},
 {id:"windows-lab",title:"Windows / File Explorer Lab",summary:"Luyện thao tác tệp và thư mục trong môi trường an toàn.",phase:4,priority:"P2",area:"Tin học",
 tasks:["Mô phỏng Desktop và File Explorer","Tạo, đổi tên, sao chép, di chuyển, xóa tệp/thư mục","Nhiệm vụ theo kỹ năng và hướng dẫn từng bước","Chấm trạng thái hệ thống tệp, reset và lưu tiến độ"]},
 {id:"python-practice",title:"Python Practice — soạn và chạy code",summary:"Lộ trình lý thuyết ngắn, code editor, chạy thử, kiểm tra tự động.",phase:4,priority:"P2",area:"Tin học",
 tasks:["Lộ trình nhóm/chương/bài Python có tiến độ","Code editor, gợi ý cú pháp và phím tắt","Sandbox chạy code an toàn, giới hạn CPU/thời gian","Chạy thử, kiểm tra bài với test cases","Gợi ý, lời giải có điều kiện, bài tiếp theo","Lưu code, nộp bài và báo cáo cá nhân/lớp"]},
 {id:"sql-practice",title:"SQL Practice — cơ sở dữ liệu",summary:"Từ SELECT đến JOIN với bộ dữ liệu mẫu và kiểm tra truy vấn.",phase:4,priority:"P2",area:"Tin học",
 tasks:["Lộ trình SQL theo chủ đề SELECT/WHERE/GROUP BY/JOIN","SQL editor có dữ liệu và bảng kết quả","Môi trường chạy truy vấn biệt lập, chỉ đọc","Test kết quả truy vấn thay vì so chữ SQL","Tiến độ, gợi ý, nộp bài và báo cáo"]},
 {id:"course-paths",title:"Lộ trình học & khóa học",summary:"Trang lớp học, chương trình, giảng viên, lịch, ghi danh và học phí.",phase:5,priority:"P2",area:"Nội dung",
 tasks:["Trang danh mục chương trình Tin học theo cấp","Lớp/khóa với lộ trình, bài, thời gian, mức độ","Trang giới thiệu lịch, giảng viên, quyền lợi và sản phẩm học viên","Đăng ký/ghi danh và xác nhận tham gia","Video, tài liệu, bài kiểm tra và % hoàn thành","Thanh toán/ưu đãi chỉ sau khi có chính sách và nhu cầu"]},
 {id:"learning-library",title:"Thư viện học liệu & cộng đồng",summary:"Tài nguyên chung có phiên bản, nguồn gốc và quyền chia sẻ.",phase:5,priority:"P2",area:"Nội dung",
 tasks:["Kho bài giảng, câu hỏi, đề, tài liệu, bài Lab","Tìm theo môn/khối/chủ đề/định dạng và tác giả","Kho cá nhân, bộ môn, trường và công khai theo quyền","Bộ sưu tập, bản sao, lưu nguồn gốc và bản quyền","Hướng dẫn, FAQ và kênh hỗ trợ cộng đồng"]},
 {id:"school-operations",title:"School Manager & phân tích",summary:"Vận hành nhiều lớp/trường, báo cáo theo vai trò và năm học.",phase:6,priority:"P3",area:"Nhà trường",
 tasks:["Tổ chức/trường/năm học/học kỳ/tổ chuyên môn","Quản lý tài khoản giáo viên, lớp và phân quyền","Sổ điểm, tổng hợp năng lực, thống kê câu khó","Audit xuất dữ liệu, báo cáo ban giám hiệu","Giám sát vận hành, sự cố và nhu cầu tăng tải"]},
 {id:"gamification-ai",title:"Trò chơi, AI & mở rộng",summary:"Đấu trường, huy hiệu và AI chỉ phát triển sau lõi giáo dục.",phase:6,priority:"P3",area:"Mở rộng",
 tasks:["Bảng xếp hạng/đội/XP tùy bật tắt","Trò chơi tương tác sử dụng chung Live Quiz engine","AI hỗ trợ soạn câu hỏi và bài giảng có người duyệt","Gợi ý luyện lại từ dữ liệu học tập được phép","Chính sách dữ liệu trẻ em, ngân sách AI và kiểm soát rủi ro","Xem xét marketplace sau khi có nhu cầu thật"]}
];

export const ROADMAP_INITIAL:RoadmapEpic[]=SEEDS.map((item,order)=>({
 id:item.id,title:item.title,summary:item.summary,phase:ROADMAP_PHASES[item.phase],
 priority:item.priority,area:item.area,status:item.status??"planned",order,
 checklist:item.tasks.map((text,index)=>({id:item.id+"-"+(index+1),text,done:item.completed?.includes(index)??false})),
 entries:(item.notes??[]).map((note,index)=>({...note,id:item.id+"-entry-"+(index+1)}))
}));
export function roadmapProgress(item:RoadmapEpic):number{
 const total=item.checklist.length;
 return total?Math.round(item.checklist.filter(t=>t.done).length/total*100):0;
}
export function roadmapTotals(items:RoadmapEpic[]){
 return {
  epics:items.length,
  done:items.filter(t=>t.status==="done").length,
  active:items.filter(t=>["analysis","design","building","testing"].includes(t.status)).length,
  subtasks:items.reduce((n,t)=>n+t.checklist.length,0),
  checked:items.reduce((n,t)=>n+t.checklist.filter(c=>c.done).length,0)
 };
}
export function roadmapAsMarkdown(items:RoadmapEpic[]):string{
 const rows=["# Xưởng Công Nghệ — Checklist quản trị","",
 "> Tài liệu xuất từ Admin Roadmap. Trạng thái phản ánh ghi nhận thủ công, không đồng nghĩa việc tính năng đã được kiểm thử Production.",""];
 let last="";
 for(const item of [...items].sort((a,b)=>a.order-b.order)){
  if(last!==item.phase){last=item.phase;rows.push("## "+last,"");}
  rows.push("### "+item.title,"","- Trạng thái: "+ROADMAP_STATUS[item.status]," - Ưu tiên: "+item.priority,"- Phân hệ: "+item.area,"- Mục tiêu: "+item.summary,"");
  for(const task of item.checklist)rows.push("- ["+(task.done?"x":" ")+"] "+task.text);
  if(item.entries.length){
   rows.push("","**Nhật ký:**");
   for(const entry of item.entries)rows.push("- "+entry.date+" · "+({note:"Ghi chú",added:"Đã thêm",fixed:"Đã sửa"}[entry.kind])+": "+entry.text);
  }
  rows.push("");
 }
 return rows.join("\n");
}
