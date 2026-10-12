/** A narrow structural representation of the cookies written by @supabase/ssr. */
export type SupabaseCookieToSet = {
  name: string;
  value: string;
  options?: {
    domain?: string;
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none" | boolean;
    expires?: Date;
  };
};
