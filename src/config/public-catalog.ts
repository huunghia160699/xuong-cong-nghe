/** Single source of truth for the public product atlas; never infer status from route existence. */
export type CatalogStatus = "available" | "building" | "planned";
export type CatalogGroup = "Học" | "Thực hành" | "Kiểm tra" | "Công cụ" | "Giáo viên";
export type CatalogIcon = "book" | "graduation" | "clipboard" | "presentation" | "file" | "sheet" | "code" | "database" | "library" | "folder" | "users" | "school" | "monitor" | "sparkles" | "game";
export type CatalogItem = {
 id:string; title:string; summary:string; group:CatalogGroup; status:CatalogStatus;
 icon:CatalogIcon; features:readonly string[]; detailHref:string;
 /** Only actions already protected by server Auth belong here. */
 actionHref?:string;
};

export const CATALOG_STATUS_LABEL:Record<CatalogStatus,string> = {
 available:"Đã có", building:"Đang phát triển", planned:"Dự kiến"
};

export const PUBLIC_CATALOG:readonly CatalogItem[] = [
 {id:"courses",title:"Khóa học & bài học",summary:"Tìm hiểu chương trình học và nội dung theo chủ đề.",group:"Học",status:"available",icon:"book",features:["Danh mục khóa học","Bài học theo chủ đề"],detailHref:"/khoa-hoc",actionHref:"/student"},
 {id:"student",title:"Student Hub",summary:"Không gian học tập, theo dõi bài học và kết quả theo tài khoản.",group:"Học",status:"available",icon:"graduation",features:["Bài học","Tiến độ cá nhân"],detailHref:"/gioi-thieu#vai-tro",actionHref:"/student"},
 {id:"quiz",title:"Trắc nghiệm",summary:"Làm bài kiểm tra và nhận phản hồi trong không gian học viên.",group:"Kiểm tra",status:"available",icon:"clipboard",features:["Câu hỏi","Kết quả theo tài khoản"],detailHref:"/gioi-thieu#he-sinh-thai",actionHref:"/student/quiz"},
 {id:"slides",title:"Thư viện trình chiếu",summary:"Khám phá các bài trình chiếu Tin học theo phần và chủ đề.",group:"Công cụ",status:"available",icon:"presentation",features:["Thư viện chủ đề","Xem bài trình chiếu"],detailHref:"/cong-cu/trinh-chieu"},
 {id:"word",title:"Word Lab",summary:"Trình mô phỏng soạn thảo đang tiếp tục được hoàn thiện và kiểm thử.",group:"Thực hành",status:"building",icon:"file",features:["Trang A4","Ribbon định dạng","Thử nghiệm editor"],detailHref:"/cong-cu#word",actionHref:"/cong-cu/mo-phong-word"},
 {id:"excel",title:"Excel Lab",summary:"Định hướng luyện bảng tính, công thức và xử lý dữ liệu.",group:"Thực hành",status:"planned",icon:"sheet",features:["Công thức","Bảng dữ liệu","Bài luyện"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"coding",title:"Lập trình thực hành",summary:"Môi trường dự kiến để học và thử nghiệm Python, HTML và CSS.",group:"Thực hành",status:"planned",icon:"code",features:["Code editor","Nhiệm vụ thực hành"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"sql",title:"SQL Practice",summary:"Thực hành truy vấn và tìm hiểu cơ sở dữ liệu trên bộ dữ liệu mẫu.",group:"Thực hành",status:"planned",icon:"database",features:["Truy vấn SQL","Dữ liệu mẫu"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"question-bank",title:"Ngân hàng câu hỏi",summary:"Tầm nhìn dùng chung câu hỏi cho bài học, bài kiểm tra và lớp.",group:"Kiểm tra",status:"planned",icon:"library",features:["Soạn câu hỏi","Dùng lại nội dung"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"live-quiz",title:"Live Quiz",summary:"Dự kiến giáo viên điều khiển phòng câu hỏi và học sinh tham gia theo mã.",group:"Kiểm tra",status:"planned",icon:"game",features:["Mã phòng","Tương tác trực tiếp"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"resources",title:"Thư viện tài nguyên",summary:"Định hướng tập hợp học liệu và tài liệu có phân quyền.",group:"Học",status:"planned",icon:"library",features:["Học liệu","Tìm kiếm","Phân quyền"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"projects",title:"Dự án ứng dụng",summary:"Hướng tới bài thực hành tổng hợp và sản phẩm của người học.",group:"Học",status:"planned",icon:"folder",features:["Dự án","Sản phẩm thực tế"],detailHref:"/#du-an"},
 {id:"teacher",title:"Teacher Studio",summary:"Không gian quản lý lớp, giao bài đang phát triển và kiểm thử trên staging.",group:"Giáo viên",status:"building",icon:"users",features:["Lớp học","Giao bài","Theo dõi"],detailHref:"/gioi-thieu#vai-tro"},
 {id:"school",title:"Quản lý trường học",summary:"Kế hoạch hỗ trợ tổ chức, giáo viên và báo cáo theo quyền.",group:"Giáo viên",status:"planned",icon:"school",features:["Nhiều lớp","Vai trò","Báo cáo"],detailHref:"/gioi-thieu#lo-trinh"},
 {id:"lab-manager",title:"Quản lý phòng máy",summary:"Ý tưởng điều hành phòng máy có cơ chế đồng ý, bảo mật và phân quyền.",group:"Công cụ",status:"planned",icon:"monitor",features:["Sơ đồ phòng","Thiết bị","An toàn"],detailHref:"/gioi-thieu#lo-trinh"}
];

export const PUBLIC_FILTERS = ["Tất cả","Học","Thực hành","Kiểm tra","Công cụ","Giáo viên"] as const;
