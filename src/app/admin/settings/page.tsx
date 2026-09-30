import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SUPERUSER_EMAIL } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Admin Settings",
};

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { error: dbError } = await supabase.from("profiles").select("id", { head: true, count: "exact" });

  const emailConfigured = Boolean(process.env.RESEND_API_KEY);
  const mpesaConfigured = Boolean(
    process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET && process.env.MPESA_SHORTCODE
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Admin Settings</h1>
        <p className="mt-1 text-sm text-slate-500">System configuration and status.</p>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Email Configuration</CardTitle>
          <CardDescription>Transactional email and member announcements (via Resend).</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Sender: {process.env.RESEND_FROM_EMAIL ?? "not set"}</span>
          <Badge variant={emailConfigured ? "emerald" : "danger"}>
            {emailConfigured ? "Configured" : "Not Configured"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Database Status</CardTitle>
          <CardDescription>Supabase Postgres connection.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Provider: Supabase</span>
          <Badge variant={dbError ? "danger" : "emerald"}>{dbError ? "Error" : "Connected"}</Badge>
        </CardContent>
      </Card>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Security</CardTitle>
          <CardDescription>Superuser account and payments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Superuser email</span>
            <span className="text-sm text-slate-200">{SUPERUSER_EMAIL}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Mpesa Daraja billing</span>
            <Badge variant={mpesaConfigured ? "emerald" : "neutral"}>
              {mpesaConfigured ? "Configured" : "Pending setup"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
