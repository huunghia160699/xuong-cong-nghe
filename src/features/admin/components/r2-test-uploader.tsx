"use client";

import { useState } from "react";

const MAX_BYTES = 25 * 1024 * 1024;

export function R2TestUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [key, setKey] = useState("");

  async function upload() {
    if (!file) return;
    if (file.size > MAX_BYTES) { setMessage("Tệp vượt giới hạn thử nghiệm 25 MB."); return; }
    setMessage("");
    setBusy(true);
    try {
      const permission = await fetch("/api/storage/presign", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      const grant = await permission.json();
      if (!permission.ok) throw new Error(grant.error ?? "Không thể cấp liên kết upload.");
      const uploaded = await fetch(grant.url, {
        method: "PUT", headers: grant.headers, body: file,
      });
      if (!uploaded.ok) throw new Error(`R2 trả về HTTP ${uploaded.status}. Kiểm tra CORS hoặc khóa R2.`);
      setKey(grant.key);
      setMessage("Tệp đã được tải lên R2. Hãy lưu mã khóa để thử tải về.");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Upload thất bại."); }
    finally { setBusy(false); }
  }

  async function download() {
    if (!key) return;
    setBusy(true);
    try {
      const response = await fetch("/api/storage/download-link", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error ?? "Không có liên kết.");
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể tải tệp."); }
    finally { setBusy(false); }
  }

  return <div className="rounded-xl border border-zinc-200 bg-white p-6">
    <h2 className="text-lg font-semibold">Kiểm thử tải tệp lên Cloudflare R2</h2>
    <p className="mt-2 text-sm leading-7 text-zinc-600">Chỉ dành cho quản trị viên. Hỗ trợ PDF, ảnh, Word, Excel, PowerPoint; tối đa 25 MB theo giao diện thử nghiệm. Chưa có danh mục, quota và kiểm tra dung lượng tệp thực tế trên R2.</p>
    <input type="file" className="mt-5 block w-full text-sm" accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.pptx"
      onChange={(event) => { setFile(event.target.files?.[0] ?? null); setKey(""); setMessage(""); }}/>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" disabled={!file || busy} onClick={upload}
        className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white disabled:opacity-40">{busy ? "Đang xử lý..." : "Tải lên R2"}</button>
      <button type="button" disabled={!key || busy} onClick={download}
        className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium disabled:opacity-40">Thử tải xuống</button>
    </div>
    {message && <p className="mt-4 break-words text-sm text-zinc-700" role="status">{message}</p>}
    {key && <p className="mt-3 break-all rounded-lg bg-zinc-50 p-3 font-mono text-xs">{key}</p>}
  </div>;
}
