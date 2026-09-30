import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EXECUTIVE_ROLES } from "@/lib/types/database";
import { ExecutiveShell } from "@/components/executive/ExecutiveShell";

// Defense-in-depth: middleware.ts (src/middleware.ts) already blocks
// unauthenticated/unauthorized requests before they reach here, but this
// layout re-checks so the gate still holds if middleware.ts is ever
// misconfigured, bypassed, or as happened once already put in the wrong
// directory and silently never loaded. createClient() throws if Supabase
// env vars aren't configured; treat that the same as "not authenticated"
// rather than letting it 500.
export default async function ExecutiveLayout({ children }: { children: ReactNode }) {
  let role: string | undefined;

  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login?next=/executive/dashboard");

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !EXECUTIVE_ROLES.includes(profile.role)) {
      redirect("/");
    }

    role = profile.role;
  } catch (err) {
    // redirect() throws internally to unwind the render Next.js tags that
    // error's `digest` with a "NEXT_REDIRECT" prefix. Let it pass through
    // unchanged; only intercept real errors (e.g. missing Supabase config).
    const digest = (err as { digest?: string } | null)?.digest;
    if (digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect("/auth/login?next=/executive/dashboard");
  }

  return <ExecutiveShell role={role as (typeof EXECUTIVE_ROLES)[number]}>{children}</ExecutiveShell>;
}
