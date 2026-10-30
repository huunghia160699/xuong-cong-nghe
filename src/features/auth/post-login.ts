import { safeNextPath } from "@/lib/supabase/config";

/**
 * A requested internal destination takes precedence over the default home.
 * Only verified profile roles can be used; unknown profiles fail closed.
 */
export function postLoginDestination(role: unknown, requestedNext: unknown): string | null {
  if (role !== "admin" && role !== "student" && role !== "teacher") return null;
  const destination = safeNextPath(requestedNext, "");
  return destination || (role === "admin" ? "/admin" : "/student");
}
