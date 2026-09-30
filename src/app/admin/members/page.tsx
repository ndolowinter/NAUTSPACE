import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Members",
};

export default async function AdminMembersPage() {
  const supabase = createClient();
  const { data: members } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "executive", "government"])
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Admin Members</h1>
        <p className="mt-1 text-sm text-slate-500">
          Accounts with elevated access (admin, executive, government roles).
        </p>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{members?.length ?? 0} account(s)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!members?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No elevated accounts yet.</p>
          )}
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {member.full_name ?? "Unnamed"}
                  <span className="ml-2 text-xs text-slate-500">{member.email}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Joined {new Date(member.created_at).toLocaleDateString()}
                  {member.is_2fa_enabled ? " · 2FA enabled" : " · 2FA not enrolled"}
                </p>
              </div>
              <Badge variant={member.role === "admin" ? "amber" : "neutral"}>{member.role}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
