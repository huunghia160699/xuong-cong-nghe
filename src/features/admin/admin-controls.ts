/** Client-side operations metadata. None of these flags grants server/database permissions. */
export const ADMIN_WORKSPACES=[
 {href:"/admin",name:"Tổng quan",description:"Điều hành và điều hướng"},
 {href:"/admin/roadmap",name:"Roadmap",description:"Các mốc, checklist và nhật ký phát triển"},
 {href:"/admin/sitemap",name:"Sitemap",description:"Kiến trúc và trạng thái module"},
 {href:"/admin/nguoi-dung",name:"Người dùng",description:"Danh sách hồ sơ có phân quyền"},
 {href:"/admin/phan-quyen",name:"Phân quyền",description:"Ma trận quyền và cổng kiểm tra"},
 {href:"/admin/cau-hinh",name:"Cấu hình",description:"Bản nháp cấu hình, xuất/nhập"},
 {href:"/admin/nhat-ky",name:"Nhật ký thao tác",description:"Nhật ký cục bộ của trình duyệt"},
 {href:"/admin/he-thong",name:"Giám sát",description:"Trạng thái module, dữ liệu và môi trường"},
 {href:"/admin/bao-cao",name:"Báo cáo",description:"Số liệu cơ sở dữ liệu khi Live"},
 {href:"/admin/khoa-hoc",name:"Khóa học",description:"Tạo bản nháp và xuất bản nội dung"},
 {href:"/admin/kho-tai-lieu",name:"Kho tài liệu",description:"Supabase Storage riêng tư"}
] as const;
export type AdminRole="guest"|"student"|"teacher"|"admin";
export const ADMIN_ROLE_MATRIX=[
 {feature:"Xem nội dung công khai",guest:true,student:true,teacher:true,admin:true},
 {feature:"Làm bài, xem tiến độ cá nhân",guest:false,student:true,teacher:false,admin:true},
 {feature:"Truy cập Admin / Roadmap",guest:false,student:false,teacher:false,admin:true},
 {feature:"Xem hồ sơ người dùng trong Admin",guest:false,student:false,teacher:false,admin:true},
 {feature:"Quản lý khóa học & kho file",guest:false,student:false,teacher:false,admin:true},
 {feature:"Cấp hoặc đổi vai trò tài khoản",guest:false,student:false,teacher:false,admin:false}
] as const;
/** The last row is deliberately false: no self-service role elevation is implemented. */
export type AdminProfile={
 id:string;display_name:string;role:"student"|"teacher"|"admin";created_at:string
};
export const PROFILE_ROLES=["all","student","teacher","admin"] as const;
export function filterProfiles(profiles:AdminProfile[],search:string,role:string):AdminProfile[]{
 const q=search.trim().toLocaleLowerCase("vi");
 return profiles.filter(p=>(role==="all"||p.role===role)&&
  (!q||[p.display_name,p.id,p.role].join(" ").toLocaleLowerCase("vi").includes(q)));
}
export function profilesToCsv(profiles:AdminProfile[]):string{
 const quote=(v:string)=>'"'+v.replace(/\r?\n/g," ").replace(/"/g,'""').replace(/^[=+@\-\t]/,"'"+v[0])+'"';
 const rows=[["ID","Tên hiển thị","Vai trò","Ngày tạo"],...profiles.map(p=>[p.id,p.display_name,p.role,p.created_at])];
 return "\uFEFF"+rows.map(r=>r.map(quote).join(",")).join("\r\n");
}
