import Link from "next/link";
import { AdminDocumentLibrary } from "@/features/admin/components/admin-document-library";
import { isLiveMode } from "@/lib/supabase/config";

export default function AdminStoragePage() {
  return <div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm text-zinc-500 underline">← Tổng quan</Link>
    <h1 className="mt-4 text-3xl font-semibold tracking-tight">Kho tài liệu</h1>
    <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
      Tài liệu được lưu riêng tư tại Supabase Storage. Chỉ quản trị viên được
      xem, tải lên, tải xuống và xóa; học viên chưa được cấp quyền.
    </p>
    {!isLiveMode() ? <div className="mt-7 rounded-xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-700">
      <h2 className="font-semibold text-zinc-900">Chế độ trình diễn</h2>
      <p className="mt-2">Kho tài liệu Supabase đã được tạo nhưng website vẫn ở Demo để bảo vệ dữ liệu.
        Sau khi kiểm thử Supabase Auth và phân quyền, quản trị viên có thể thao tác trực tiếp tại đây.</p>
    </div> : <div className="mt-7"><AdminDocumentLibrary /></div>}
  </div>;
}
