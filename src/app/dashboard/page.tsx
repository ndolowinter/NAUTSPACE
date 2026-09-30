import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApplicationStatusTracker } from "@/components/dashboard/ApplicationStatusTracker";
import { MembershipBanner } from "@/components/dashboard/MembershipBanner";
import { isSuperuserEmail } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default async function DashboardPage() {
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient();
  } catch {
    redirect("/auth/login?next=/dashboard");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard");

  const [{ data: profile }, { data: applications }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase
      .from("applications")
      .select("*")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("memberships").select("*").eq("user_id", user.id).single(),
  ]);

  return (
    <div className="container space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{profile?.email ?? user.email}</p>
      </div>

      {membership && (
        <MembershipBanner
          membership={membership}
          lifetime={isSuperuserEmail(profile?.email ?? user.email)}
        />
      )}

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your careers & academy submissions here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!applications?.length && (
            <p className="text-sm text-slate-500">
              You haven&apos;t submitted an application yet visit{" "}
              <a href="/careers" className="text-cyan hover:text-cyan/80">
                Careers &amp; Academy
              </a>{" "}
              to get started.
            </p>
          )}
          {applications?.map((application) => (
            <ApplicationStatusTracker key={application.id} application={application} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
