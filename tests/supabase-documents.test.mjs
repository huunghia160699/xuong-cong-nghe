import assert from "node:assert/strict";
import test from "node:test";
import {
  DOCUMENT_BUCKET, DOCUMENT_FOLDER, MAX_DOCUMENT_SIZE,
  safeDocumentName, storagePath, originalName, validateDocument, fileSizeText
} from "../src/lib/storage/supabase-documents.ts";

test("Admin object paths are generated under private bucket", () => {
  assert.equal(DOCUMENT_BUCKET, "xcn-private-documents");
  assert.equal(DOCUMENT_FOLDER, "admin");
  const key = storagePath("Tài liệu.xlsx", "01234567-89ab-4def-8123-456789abcdef");
  assert.equal(key, "admin/01234567-89ab-4def-8123-456789abcdef--Tài liệu.xlsx");
  assert.equal(originalName(key.split("/").pop()), "Tài liệu.xlsx");
});
test("traversal and invalid filenames are sanitized", () => {
  assert.equal(safeDocumentName("a/b.pdf"), "a_b.pdf");
  assert.equal(safeDocumentName("a..b.pdf"), "a.b.pdf");
  assert.throws(() => safeDocumentName(""));
  assert.throws(() => storagePath("file.pdf", "bad-id"));
});
test("file extension, MIME and size are validated", () => {
  const mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  assert.equal(validateDocument({name:"demo.xlsx",type:mime,size:1024}).contentType,mime);
  assert.throws(() => validateDocument({name:"file.exe",type:"application/pdf",size:10}));
  assert.throws(() => validateDocument({name:"file.pdf",type:"application/x-binary",size:10}));
  assert.throws(() => validateDocument({name:"file.pdf",type:"application/pdf",size:0}));
  assert.throws(() => validateDocument({name:"file.pdf",type:"application/pdf",size:MAX_DOCUMENT_SIZE+1}));
});
test("size labels", () => {
  assert.equal(fileSizeText(100), "100 B");
  assert.equal(fileSizeText(1024), "1.0 KB");
  assert.equal(fileSizeText(1048576), "1.0 MB");
});
