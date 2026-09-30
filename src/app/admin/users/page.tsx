import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSearch, type AdminUserRow } from "@/components/admin/UserSearch";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const supabase = createClient();

  const [{ data: profiles }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("memberships").select("user_id, status, trial_ends_at"),
  ]);

  const membershipByUser = new Map((memberships ?? []).map((m) => [m.user_id, m]));

  const rows: AdminUserRow[] = (profiles ?? []).map((p) => {
    const membership = membershipByUser.get(p.id);
    return {
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      role: p.role,
      organization: p.organization,
      created_at: p.created_at,
      membershipStatus: membership?.status ?? null,
      trialEndsAt: membership?.trial_ends_at ?? null,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Users</h1>
        <p className="mt-1 text-sm text-slate-500">All member accounts and their membership status.</p>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{rows.length} user(s)</CardTitle>
        </CardHeader>
        <CardContent>
          <UserSearch users={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
