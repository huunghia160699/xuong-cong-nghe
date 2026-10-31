/** Live mode must never fall back to demo when configuration is incomplete. */
export function isLiveMode(): boolean {
  // Vercel previews and production must NEVER silently become unauthenticated Demo.
  // Offline development remains Demo unless the developer explicitly enables live mode.
  return process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false";
}

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY. Hãy cấu hình Supabase trước khi bật live mode.");
  }
  return { url, anonKey };
}

export function safeNextPath(value: unknown, fallback = "/student"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("\n") || value.includes("\r")) return fallback;
  if (value.startsWith("/auth/") || value.startsWith("/api/")) return fallback;
  return value;
}
