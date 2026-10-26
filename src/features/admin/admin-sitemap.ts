/** Target sitemap: implemented URLs are distinguished from planned ones. */
export type SitemapLink={title:string;href:string;state:"available"|"planned";note?:string};
export type SitemapGroup={title:string;summary:string;links:SitemapLink[]};
export const ADMIN_SITEMAP:SitemapGroup[]=[
 {title:"Công khai & tài khoản",summary:"Landing, giới thiệu, tài khoản và lối vào nhanh.",
 links:[
 {title:"Trang chủ",href:"/",state:"available"},
 {title:"Danh mục khóa học",href:"/khoa-hoc",state:"available"},
 {title:"Công cụ",href:"/cong-cu",state:"available"},
 {title:"Đăng nhập",href:"/dang-nhap",state:"available"},
 {title:"Đăng ký",href:"/dang-ky",state:"available"},
 {title:"Tham gia phòng bằng mã",href:"/tham-gia",state:"planned"},
 {title:"Thư viện công khai",href:"/thu-vien",state:"planned"},
 {title:"Trợ giúp & cộng đồng",href:"/ho-tro",state:"planned"}]},
 {title:"Quản trị toàn hệ thống",summary:"Đã có admin cơ bản; các phân hệ mới được theo dõi theo roadmap.",
 links:[
 {title:"Tổng quan",href:"/admin",state:"available"},
 {title:"Roadmap dọc",href:"/admin/roadmap",state:"available"},
 {title:"Sitemap hệ thống",href:"/admin/sitemap",state:"available"},
 {title:"Quản lý khóa học",href:"/admin/khoa-hoc",state:"available"},
 {title:"Kho tài liệu",href:"/admin/kho-tai-lieu",state:"available"},
 {title:"Quản lý người dùng",href:"/admin/nguoi-dung",state:"planned"},
 {title:"Phân quyền & nhật ký",href:"/admin/phan-quyen",state:"planned"},
 {title:"Cấu hình website",href:"/admin/cau-hinh",state:"planned"}]},
 {title:"Teacher Studio",summary:"Dạy học, quản lý lớp, soạn nội dung và theo dõi kết quả.",
 links:[
 {title:"Dashboard giáo viên",href:"/giao-vien",state:"planned"},
 {title:"Lớp & học sinh",href:"/giao-vien/lop-hoc",state:"planned"},
 {title:"Ngân hàng câu hỏi",href:"/giao-vien/ngan-hang",state:"planned"},
 {title:"Đề kiểm tra",href:"/giao-vien/de-thi",state:"planned"},
 {title:"Bài giảng",href:"/giao-vien/bai-giang",state:"planned"},
 {title:"Live Quiz",href:"/giao-vien/live-quiz",state:"planned"},
 {title:"Bài được giao",href:"/giao-vien/giao-bai",state:"planned"},
 {title:"Báo cáo lớp",href:"/giao-vien/bao-cao",state:"planned"}]},
 {title:"Student Hub",summary:"Không gian học tập và thực hành trên điện thoại.",
 links:[
 {title:"Tổng quan học viên hiện có",href:"/student",state:"available"},
 {title:"Quiz hiện có",href:"/student/quiz",state:"available"},
 {title:"Lớp của em",href:"/hoc-sinh/lop-hoc",state:"planned"},
 {title:"Bài được giao",href:"/hoc-sinh/bai-tap",state:"planned"},
 {title:"Tiến độ học tập",href:"/hoc-sinh/tien-do",state:"planned"},
 {title:"Phòng trả lời trực tiếp",href:"/play/[code]",state:"planned"}]},
 {title:"Tin học & Learning Labs",summary:"Lõi khác biệt của sản phẩm: học và thực hành ngay trên trình duyệt.",
 links:[
 {title:"Trình chiếu React",href:"/cong-cu/trinh-chieu",state:"available"},
 {title:"Mô phỏng Word",href:"/cong-cu/mo-phong-word",state:"available"},
 {title:"Word Lab nhiệm vụ",href:"/thuc-hanh/word",state:"planned"},
 {title:"Excel Lab",href:"/thuc-hanh/excel",state:"planned"},
 {title:"PowerPoint Lab",href:"/thuc-hanh/powerpoint",state:"planned"},
 {title:"File Explorer Lab",href:"/thuc-hanh/windows",state:"planned"},
 {title:"Python Practice",href:"/thuc-hanh/python",state:"planned"},
 {title:"SQL Practice",href:"/thuc-hanh/sql",state:"planned"}]},
 {title:"Khóa học & học liệu",summary:"Lộ trình đa cấp và nội dung dùng lại được.",
 links:[
 {title:"Lộ trình Tin học",href:"/lo-trinh/tin-hoc",state:"planned"},
 {title:"Lớp trực tuyến / ghi danh",href:"/lop-hoc",state:"planned"},
 {title:"Thư viện bài giảng",href:"/thu-vien/bai-giang",state:"planned"},
 {title:"Thư viện bộ đề",href:"/thu-vien/de-thi",state:"planned"},
 {title:"Kho bài thực hành",href:"/thu-vien/thuc-hanh",state:"planned"}]},
 {title:"School Manager & tương lai",summary:"Phân hệ sau khi hoàn thiện lõi giáo dục Tin học.",
 links:[
 {title:"Không gian trường",href:"/truong",state:"planned"},
 {title:"Quản lý giáo viên",href:"/truong/giao-vien",state:"planned"},
 {title:"Báo cáo trường",href:"/truong/bao-cao",state:"planned"},
 {title:"Đấu trường & trò chơi",href:"/tro-choi",state:"planned"},
 {title:"AI hỗ trợ soạn bài",href:"/ai",state:"planned"}]}
];
