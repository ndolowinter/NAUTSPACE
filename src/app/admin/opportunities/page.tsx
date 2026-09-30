import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Manage Opportunities",
};

export default async function OpportunitiesAdminPage() {
  const supabase = createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Manage Opportunities</h1>
          <p className="mt-1 text-sm text-slate-500">Internships, competitions, jobs, and scholarships.</p>
        </div>
        <Link href="/admin/opportunities/new" className={cn(buttonVariants(), "gap-1.5")}>
          Add Opportunity
        </Link>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {opportunities?.length ?? 0} opportunity(ies)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!opportunities?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No opportunities yet.</p>
          )}
          {opportunities?.map((opp) => (
            <div
              key={opp.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-800 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {opp.title}
                  {opp.featured && (
                    <Badge variant="amber" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {opp.organization ?? "—"}
                  {opp.application_deadline
                    ? ` · Deadline ${new Date(opp.application_deadline).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="neutral">{opp.type}</Badge>
                <Badge variant={opp.status === "published" ? "emerald" : "neutral"}>{opp.status}</Badge>
                <Link
                  href={`/admin/opportunities/${opp.id}/edit`}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
