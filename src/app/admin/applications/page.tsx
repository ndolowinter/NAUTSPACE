import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationStatusControl } from "@/components/admin/ApplicationStatusControl";
import { APPLICATION_TRACK_LABELS } from "@/lib/applicationTracks";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
  const supabase = createClient();

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const applicantIds = [...new Set((applications ?? []).map((a) => a.applicant_id))];
  const { data: profiles } =
    applicantIds.length > 0
      ? await supabase.from("profiles").select("id, full_name, email").in("id", applicantIds)
      : { data: [] };

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const rows = await Promise.all(
    (applications ?? []).map(async (application) => {
      const { data: signedUrlData } = await supabase.storage
        .from("resumes")
        .createSignedUrl(application.resume_url, 60 * 60);

      return {
        ...application,
        applicant: profileById.get(application.applicant_id) ?? null,
        resumeSignedUrl: signedUrlData?.signedUrl ?? null,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review resumes and move Careers & Academy and Be a Pilot applicants through the pipeline.
        </p>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle>{rows.length} application(s)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No applications submitted yet.</p>
          )}
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {row.applicant?.full_name ?? "Unknown applicant"}
                  <span className="ml-2 text-xs text-slate-500">
                    {row.applicant?.email ?? "no email on file"}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-slate-400">
                  {APPLICATION_TRACK_LABELS[row.track] ?? row.track} &middot;{" "}
                  {new Date(row.created_at).toLocaleDateString()}
                </p>
                {row.cover_note && (
                  <p className="mt-1 max-w-xl truncate text-xs text-slate-500">{row.cover_note}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {row.resumeSignedUrl ? (
                  <a
                    href={row.resumeSignedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-cyan hover:text-cyan/80"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-xs text-slate-600">resume unavailable</span>
                )}
                <ApplicationStatusControl applicationId={row.id} status={row.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
