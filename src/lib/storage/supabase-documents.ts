export const DOCUMENT_BUCKET = "xcn-private-documents";
export const DOCUMENT_FOLDER = "admin";
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024;
export const PAGE_SIZE = 50;

export const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
};

export function safeDocumentName(name: string): string {
  const result = name.normalize("NFC").replace(/[\/\\<>:"|?*]/g, "_")
    .split("").filter((char) => char >= " ").join("")
    .replace(/\.{2,}/g, ".").trim().slice(0, 120);
  if (!result || result === ".") throw new Error("Tên tệp không hợp lệ.");
  return result;
}

export function validateDocument(file: {name: string; type: string; size: number}) {
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Chỉ nhận tệp từ 1 byte đến 20 MB.");
  }
  const name = safeDocumentName(file.name);
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const contentType = MIME_BY_EXTENSION[ext];
  if (!contentType || (file.type && file.type.toLowerCase() !== contentType)) {
    throw new Error("Định dạng không được hỗ trợ hoặc loại tệp không phù hợp.");
  }
  return {name, contentType};
}

export function storagePath(name: string, id: string): string {
  if (!/^[a-f0-9-]{36}$/i.test(id)) throw new Error("Mã tệp không hợp lệ.");
  return DOCUMENT_FOLDER + "/" + id + "--" + safeDocumentName(name);
}

export function originalName(storedName: string): string {
  return storedName.replace(/^[a-f0-9-]{36}--/i, "");
}

export function fileSizeText(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
