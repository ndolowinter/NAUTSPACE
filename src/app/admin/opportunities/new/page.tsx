import type { Metadata } from "next";
import { OpportunityForm } from "@/components/admin/OpportunityForm";

export const metadata: Metadata = {
  title: "Add Opportunity",
};

export default function NewOpportunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-50">Add Opportunity</h1>
        <p className="mt-1 text-sm text-slate-500">Add a new opportunity for members.</p>
      </div>
      <OpportunityForm />
    </div>
  );
}
