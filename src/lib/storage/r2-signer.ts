import { createHash, createHmac } from "node:crypto";

/**
 * Minimal AWS Signature V4 presigner for the Cloudflare R2 S3-compatible API.
 * This module only signs one object request; it does not transmit credentials.
 * Keep API keys on the server. Never import this into a client component.
 */
export type R2SignerConfig = {
  accountId: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type SignedObjectRequest = {
  method: "GET" | "PUT";
  key: string;
  contentType?: string;
  expiresIn?: number;
  now?: Date;
};

function encode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    "%" + char.charCodeAt(0).toString(16).toUpperCase()
  );
}

function hmac(key: string | Buffer, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function canonicalQuery(params: Record<string, string>): string {
  return Object.entries(params).map(([name, value]) => [encode(name), encode(value)])
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([name, value]) => `${name}=${value}`).join("&");
}

export function presignR2Object(config: R2SignerConfig, input: SignedObjectRequest): string {
  const { accountId, bucket, accessKeyId, secretAccessKey } = config;
  if (!/^[a-f0-9]{32}$/i.test(accountId)) throw new Error("R2_ACCOUNT_ID không hợp lệ.");
  if (!/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)) throw new Error("R2_BUCKET không hợp lệ.");
  if (!accessKeyId || !secretAccessKey) throw new Error("Thiếu khóa Cloudflare R2.");
  if (!input.key || input.key.startsWith("/") || input.key.split("/").some((part) =>
    part === "." || part === ".." || !part
  )) throw new Error("Đường dẫn đối tượng không hợp lệ.");
  if (input.method !== "GET" && input.method !== "PUT") throw new Error("Phương thức không hợp lệ.");
  const expiresIn = input.expiresIn ?? 300;
  if (!Number.isSafeInteger(expiresIn) || expiresIn < 1 || expiresIn > 3600) {
    throw new Error("Thời hạn chữ ký không hợp lệ.");
  }
  if (input.contentType && /[\r\n]/.test(input.contentType)) throw new Error("Content-Type không hợp lệ.");
  if (input.method === "PUT" && !input.contentType) throw new Error("Cần Content-Type khi upload.");

  const date = input.now ?? new Date();
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const day = amzDate.slice(0, 8);
  const scope = `${day}/auto/s3/aws4_request`;
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const pathname = `/${encode(bucket)}/${input.key.split("/").map(encode).join("/")}`;

  const signedHeaders = input.contentType ? "content-type;host" : "host";
  const canonicalHeaders = input.contentType ?
    `content-type:${input.contentType.trim().toLowerCase()}\nhost:${host}\n` :
    `host:${host}\n`;

  const query = canonicalQuery({
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
    "X-Amz-Credential": `${accessKeyId}/${scope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": signedHeaders,
  });
  const canonicalRequest = [
    input.method, pathname, query, canonicalHeaders, signedHeaders, "UNSIGNED-PAYLOAD",
  ].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const dateKey = hmac("AWS4" + secretAccessKey, day);
  const regionKey = hmac(dateKey, "auto");
  const serviceKey = hmac(regionKey, "s3");
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = hmac(signingKey, stringToSign).toString("hex");
  return `https://${host}${pathname}?${query}&X-Amz-Signature=${signature}`;
}
