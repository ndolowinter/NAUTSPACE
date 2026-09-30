import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Contacts",
};

const INQUIRY_LABELS: Record<string, string> = {
  defense_agency: "Defense Agency",
  university: "University",
  venture_partner: "Venture Partner",
  government: "Government",
  general_b2b: "General B2B",
};

export default async function AdminContactsPage() {
  const supabase = createClient();
  const { data: inquiries } = await supabase
    .from("partnership_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Contacts</h1>
        <p className="mt-1 text-sm text-slate-500">Partnership and contact form submissions.</p>
      </div>

      <Card className="border-slate-800 bg-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">{inquiries?.length ?? 0} submission(s)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!inquiries?.length && (
            <p className="py-8 text-center text-sm text-slate-500">No submissions yet.</p>
          )}
          {inquiries?.map((inquiry) => (
            <div key={inquiry.id} className="rounded-lg border border-slate-800 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-100">
                  {inquiry.organization_name}
                  <span className="ml-2 text-xs text-slate-500">{inquiry.contact_name}</span>
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">{INQUIRY_LABELS[inquiry.inquiry_type] ?? inquiry.inquiry_type}</Badge>
                  <Badge variant={inquiry.classified_priority <= 2 ? "danger" : "neutral"}>
                    Priority {inquiry.classified_priority}
                  </Badge>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                <a href={`mailto:${inquiry.contact_email}`} className="hover:text-cyan">
                  {inquiry.contact_email}
                </a>{" "}
                &middot; {new Date(inquiry.created_at).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-slate-400">{inquiry.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
