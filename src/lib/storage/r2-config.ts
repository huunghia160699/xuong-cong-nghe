import { presignR2Object, type SignedObjectRequest } from "@/lib/storage/r2-signer";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Chưa cấu hình Cloudflare R2 trên máy chủ.");
    this.name = "StorageNotConfiguredError";
  }
}

/** Non-public environment variables only; do not copy R2 secrets into NEXT_PUBLIC_ keys. */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
  );
}

export function signPrivateR2Request(input: SignedObjectRequest): string {
  if (!isR2Configured()) throw new StorageNotConfiguredError();
  return presignR2Object({
    accountId: process.env.R2_ACCOUNT_ID!,
    bucket: process.env.R2_BUCKET!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  }, input);
}
