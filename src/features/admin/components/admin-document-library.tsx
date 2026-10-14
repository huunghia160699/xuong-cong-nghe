"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  DOCUMENT_BUCKET, DOCUMENT_FOLDER, MAX_DOCUMENT_SIZE, PAGE_SIZE,
  fileSizeText, originalName, storagePath, validateDocument,
} from "@/lib/storage/supabase-documents";

type DocumentItem = { name: string; bytes: number; createdAt: string | null };

export function AdminDocumentLibrary() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [inputIndex, setInputIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reload = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    const result = await supabase.storage.from(DOCUMENT_BUCKET).list(DOCUMENT_FOLDER, {
      limit: PAGE_SIZE, offset: p * PAGE_SIZE,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (result.error) {
      setError("Không thể tải kho tài liệu: " + result.error.message);
    } else {
      const rows = result.data ?? [];
      setItems(rows.filter((entry) => entry.metadata != null).map((entry) => ({
        name: entry.name,
        bytes: Number(entry.metadata?.size ?? 0),
        createdAt: entry.created_at ?? null,
      })));
      setHasNext(rows.length === PAGE_SIZE);
      setPage(p);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void reload(0); }, [reload]);

  async function handleUpload() {
    if (!file || working) return;
    let safeName: string;
    let contentType: string;
    try {
      const result = validateDocument(file);
      safeName = result.name;
      contentType = result.contentType;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tệp không hợp lệ.");
      return;
    }
    setWorking(true);
    setError("");
    setNotice("");
    const path = storagePath(safeName, crypto.randomUUID());
    const result = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, file, {
      upsert: false, contentType, cacheControl: "3600",
    });
    if (result.error) {
      setError("Tải lên thất bại: " + result.error.message);
    } else {
      setNotice("Đã tải lên " + safeName);
      setFile(null);
      setInputIndex((i) => i + 1);
      await reload(0);
    }
    setWorking(false);
  }

  async function handleDownload(item: DocumentItem) {
    if (working) return;
    setWorking(true);
    setError("");
    const result = await supabase.storage.from(DOCUMENT_BUCKET)
      .createSignedUrl(DOCUMENT_FOLDER + "/" + item.name, 90, {
        download: originalName(item.name),
      });
    if (result.error || !result.data?.signedUrl) {
      setError("Không thể tạo liên kết tải tệp: " + (result.error?.message ?? "Không xác định"));
    } else {
      const anchor = document.createElement("a");
      anchor.href = result.data.signedUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }
    setWorking(false);
  }

  async function handleDelete(item: DocumentItem) {
    if (working || !window.confirm("Xóa vĩnh viễn: " + originalName(item.name) + "?")) return;
    setWorking(true);
    setError("");
    setNotice("");
    const result = await supabase.storage.from(DOCUMENT_BUCKET)
      .remove([DOCUMENT_FOLDER + "/" + item.name]);
    if (result.error) setError("Xóa thất bại: " + result.error.message);
    else {
      setNotice("Đã xóa " + originalName(item.name));
      await reload(page > 0 && items.length === 1 ? page - 1 : page);
    }
    setWorking(false);
  }

  return <div className="grid gap-6">
    <section className="rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Tải tài liệu lên</h2>
      <p className="mt-2 text-sm leading-7 text-zinc-600">
        Hỗ trợ PDF, Word, Excel, PowerPoint, TXT và hình ảnh; tối đa {fileSizeText(MAX_DOCUMENT_SIZE)}/tệp.
        Tệp chỉ dành cho Admin. Tệp trên 6 MB cần đường truyền ổn định; chức năng tiếp tục upload sẽ bổ sung sau.
      </p>
      <input type="file" key={inputIndex} className="mt-5 block w-full text-sm"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp"
        onChange={(event) => {setFile(event.target.files?.[0] ?? null);setError("");}} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void handleUpload()} disabled={!file || working || file.size > MAX_DOCUMENT_SIZE}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">
          {working ? "Đang xử lý..." : "Tải lên Supabase"}
        </button>
        {file && <span className="text-xs text-zinc-500">{fileSizeText(file.size)}</span>}
      </div>
    </section>

    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 p-5">
        <div>
          <h2 className="font-semibold">Tài liệu đã lưu</h2>
          <p className="mt-1 text-xs text-zinc-500">Kho riêng tư · trang {page + 1} · {PAGE_SIZE} tệp/trang</p>
        </div>
        <button type="button" onClick={() => void reload(page)} disabled={loading || working}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium disabled:opacity-40">Làm mới</button>
      </div>
      {error && <p role="alert" className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="m-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">{notice}</p>}
      {loading ? <p className="p-6 text-sm text-zinc-500">Đang tải danh sách...</p> :
        items.length === 0 ? <p className="p-6 text-sm text-zinc-500">Chưa có tài liệu.</p> :
        <ul className="divide-y divide-zinc-100">
          {items.map((item) => <li key={item.name} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="break-all text-sm font-medium">{originalName(item.name)}</p>
              <p className="mt-1 text-xs text-zinc-500">{fileSizeText(item.bytes)} · {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "Không rõ ngày"}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" disabled={working} onClick={() => void handleDownload(item)}
                className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium disabled:opacity-40">Tải xuống</button>
              <button type="button" disabled={working} onClick={() => void handleDelete(item)}
                className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium text-red-700 disabled:opacity-40">Xóa</button>
            </div>
          </li>)}
        </ul>}
      <div className="flex justify-end gap-3 border-t border-zinc-200 p-4">
        <button type="button" disabled={page === 0 || loading || working} onClick={() => void reload(page - 1)}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium disabled:opacity-40">Trước</button>
        <button type="button" disabled={!hasNext || loading || working} onClick={() => void reload(page + 1)}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-medium disabled:opacity-40">Tiếp</button>
      </div>
    </section>
  </div>;
}
