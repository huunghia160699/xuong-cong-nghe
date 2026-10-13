import test from "node:test";
import assert from "node:assert/strict";
import { presignR2Object } from "../src/lib/storage/r2-signer.ts";

const config = {
  accountId: "0123456789abcdef0123456789abcdef",
  bucket: "xcn-private",
  accessKeyId: "test-access",
  secretAccessKey: "test-secret",
};
const now = new Date("2026-10-13T16:00:00.000Z");

test("signed PUT URL scopes key, expiry and Content-Type", () => {
  const url = new URL(presignR2Object(config, {
    method: "PUT", key: "private/admin/u/one test.pdf", contentType: "application/pdf", expiresIn: 300, now,
  }));
  assert.equal(url.hostname, "0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com");
  assert.equal(url.pathname, "/xcn-private/private/admin/u/one%20test.pdf");
  assert.equal(url.searchParams.get("X-Amz-SignedHeaders"), "content-type;host");
  assert.equal(url.searchParams.get("X-Amz-Expires"), "300");
  assert.match(url.searchParams.get("X-Amz-Signature"), /^[a-f0-9]{64}$/);
});

test("GET signature differs from PUT and does not sign Content-Type", () => {
  const key = "private/admin/u/file.pdf";
  const get = new URL(presignR2Object(config, { method: "GET", key, now }));
  const put = new URL(presignR2Object(config, { method: "PUT", key, contentType: "application/pdf", now }));
  assert.equal(get.searchParams.get("X-Amz-SignedHeaders"), "host");
  assert.notEqual(get.searchParams.get("X-Amz-Signature"), put.searchParams.get("X-Amz-Signature"));
  assert.equal(get.searchParams.get("X-Amz-Date"), "20261013T160000Z");
});

test("reject invalid bucket, key and TTL", () => {
  assert.throws(() => presignR2Object(config, {method:"GET",key:"private/../secret"}));
  assert.throws(() => presignR2Object(config, {method:"GET",key:"safe",expiresIn:900000}));
  assert.throws(() => presignR2Object({...config,bucket:"bad!name"},{method:"GET",key:"safe"}));
  assert.throws(() => presignR2Object(config,{method:"PUT",key:"safe"}));
});
