import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SUPERUSER_EMAIL } from "@/lib/types/database";
import { AdminShell } from "@/components/admin/AdminShell";

// Defense-in-depth: middleware.ts already blocks anyone but the superuser
// before this ever renders, but this layout re-checks the same way
// executive/layout.tsx does, in case middleware is ever bypassed or
// misconfigured.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login?next=/admin");

    if (user.email?.toLowerCase() !== SUPERUSER_EMAIL.toLowerCase()) {
      redirect("/");
    }
  } catch (err) {
    const digest = (err as { digest?: string } | null)?.digest;
    if (digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect("/auth/login?next=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
