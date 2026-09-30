import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OpportunityForm } from "@/components/admin/OpportunityForm";

export const metadata: Metadata = {
  title: "Edit Opportunity",
};

export default async function EditOpportunityPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: opportunity } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!opportunity) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Edit Opportunity</h1>
        <p className="mt-1 text-sm text-slate-500">{opportunity.title}</p>
      </div>
      <OpportunityForm opportunity={opportunity} />
    </div>
  );
}
