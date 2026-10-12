import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { SupabaseCookieToSet } from "@/lib/supabase/cookie-types";

/** Server-only by design. Only call from Route Handlers, Server Actions or Server Components. */
export async function createSupabaseServerClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(items: SupabaseCookieToSet[]) {
        try {
          items.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. Middleware refreshes the session.
        }
      },
    },
  });
}
