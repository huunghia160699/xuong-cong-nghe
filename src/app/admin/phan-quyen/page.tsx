import Link from "next/link";
import {ShieldCheck,ShieldAlert,Check,X} from "lucide-react";
import {ADMIN_ROLE_MATRIX} from "@/features/admin/admin-controls";
import {isLiveMode} from "@/lib/supabase/config";
export default function AdminPermissionsPage(){
 const live=isLiveMode();
 return <div className="xcn-admin">
  <div className="xcn-admin-heading"><div><h1>Phân quyền hệ thống</h1>
   <p>Ma trận quyền dự kiến theo mã nguồn và các chốt bảo vệ hiện có. Đây không phải kết quả kiểm thử JWT production.</p></div>
   <Link href="/admin/he-thong" className="xcn-admin-primary"><ShieldCheck size={16}/> Kiểm tra hệ thống</Link>
  </div>
  <div className="xcn-admin-notice"><ShieldAlert size={18}/> Việc cấp Admin và xác minh hai tài khoản đang tạm dừng. Giao diện không có nút tự đổi vai trò.</div>
  <section className="xcn-admin-panel">
   <h2 className="font-bold text-lg">Ma trận quyền tham chiếu</h2>
   <div className="xcn-admin-table-wrap mt-4"><table className="xcn-admin-table"><thead><tr>
    <th>Chức năng</th><th>Khách</th><th>Học sinh</th><th>Giáo viên</th><th>Admin</th></tr></thead>
    <tbody>{ADMIN_ROLE_MATRIX.map(item=><tr key={item.feature}><td className="font-semibold">{item.feature}</td>
     {(["guest","student","teacher","admin"] as const).map(role=><td key={role} className="text-center">
      {item[role]?<Check size={18} className="mx-auto text-emerald-700"/>:<X size={18} className="mx-auto text-slate-400"/>}
     </td>)}</tr>)}</tbody></table></div>
   <p className="mt-3 text-xs leading-6 text-slate-500">Quyền Teacher Studio, School Manager và đa vai trò chưa được triển khai đầy đủ. Ma trận chỉ nêu các khả năng đang thiết kế, không thay thế kiểm soát thực tế từ RLS và server.</p>
  </section>
  <div className="xcn-admin-duo">
   <section className="xcn-admin-panel"><h2 className="font-bold">Các lớp bảo vệ</h2>
    <ul className="xcn-admin-checks">
     <li><ShieldCheck size={17}/> Admin layout xác thực người dùng và <code>profiles.role</code> ở Live</li>
     <li><ShieldCheck size={17}/> Roadmap API kiểm tra vai trò trên server và RLS trên database</li>
     <li><ShieldCheck size={17}/> Cấm người dùng tự chỉnh <code>profiles.role</code></li>
     <li><ShieldCheck size={17}/> Không đặt secret/service-role key vào trình duyệt</li>
    </ul></section>
   <section className="xcn-admin-panel"><h2 className="font-bold">Điều kiện trước khi bật Live</h2>
    <ul className="xcn-admin-checks">
     <li><ShieldAlert size={17}/> Kiểm thử JWT Admin và học sinh vẫn tạm dừng</li>
     <li><ShieldAlert size={17}/> Kiểm tra <code>is_admin()</code> và các policy phụ thuộc riêng</li>
     <li><ShieldAlert size={17}/> Chưa có quy trình duyệt thay đổi vai trò trên UI</li>
     <li><ShieldAlert size={17}/> Môi trường: {live?"Live đang bật":"Demo — không thực thi quyền người dùng thật"}</li>
    </ul></section>
  </div>
 </div>;
}
