import Link from "next/link";
import { R2TestUploader } from "@/features/admin/components/r2-test-uploader";
import { isLiveMode } from "@/lib/supabase/config";
import { isR2Configured } from "@/lib/storage/r2-config";

export default function AdminStoragePage() {
  const live = isLiveMode();
  const ready = isR2Configured();
  return <div className="mx-auto max-w-3xl">
    <Link href="/admin" className="text-sm text-zinc-500 underline">← Tổng quan</Link>
    <h1 className="mt-4 text-3xl font-bold">Kho tệp R2</h1>
    <p className="mt-3 text-sm leading-7 text-zinc-600">Đây là chức năng thử nghiệm của Admin. Chưa đưa vào thư viện học viên hoặc nội dung trả phí.</p>
    {!live ? <p className="mt-7 rounded-xl border border-zinc-200 p-6 text-sm">Chế độ Demo: cần bật và kiểm thử Supabase Auth trước khi sử dụng kho tệp R2.</p> :
    !ready ? <p className="mt-7 rounded-xl border border-zinc-200 p-6 text-sm">Chưa cấu hình R2 trên Vercel. Cần R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID và R2_SECRET_ACCESS_KEY.</p> :
    <div className="mt-7"><R2TestUploader /></div>}
  </div>;
}
