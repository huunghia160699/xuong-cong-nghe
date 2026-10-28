import { AdminDocumentLibrary } from "@/features/admin/components/admin-document-library";
import { isLiveMode } from "@/lib/supabase/config";

export default function AdminStoragePage() {
  return <div className="xcn-admin">
    <div className="xcn-admin-heading"><div>
      <h1>Kho tài liệu</h1>
      <p>Tài liệu được lưu riêng tư tại Supabase Storage. Chỉ quản trị viên được
       xem, tải lên, tải xuống và xóa; học viên chưa được cấp quyền.</p>
    </div></div>
    {!isLiveMode() ? <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 text-sm leading-7 text-zinc-700">
      <h2 className="font-semibold text-zinc-900">Chế độ trình diễn</h2>
      <p className="mt-2">Kho tài liệu Supabase đã được tạo nhưng website vẫn ở Demo để bảo vệ dữ liệu.
        Sau khi kiểm thử Supabase Auth và phân quyền, quản trị viên có thể thao tác trực tiếp tại đây.</p>
    </div> : <div className="mt-7"><AdminDocumentLibrary /></div>}
  </div>;
}
