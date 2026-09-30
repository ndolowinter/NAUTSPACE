import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { DaoProposalCard } from "@/components/executive/DaoProposalCard";
import { TreasuryPanel } from "@/components/executive/TreasuryPanel";
import type { DaoProposal, UserRole } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "NAUTSPACE HORIZON",
};

const FALLBACK_PROPOSALS: DaoProposal[] = [
  {
    id: "fallback-1",
    title: "Fund Phase 2 UAV Border Corridor Expansion",
    description: "Allocate treasury funds to extend autonomous UAV patrol coverage along the northern border corridor.",
    proposed_by: "fallback",
    votes_for: 14,
    votes_against: 3,
    status: "active",
    gov_override_active: false,
    gov_override_reason: null,
    treasury_amount: 85,
    treasury_asset: "ETH",
    voting_opens_at: null,
    voting_closes_at: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
  {
    id: "fallback-2",
    title: "NautSpace International-SAT-03 Launch Manifest Approval",
    description: "Approve manifest slot and treasury disbursement for the next CubeSat launch window.",
    proposed_by: "fallback",
    votes_for: 9,
    votes_against: 1,
    status: "active",
    gov_override_active: true,
    gov_override_reason: "Pending export-control review before launch manifest is finalized.",
    treasury_amount: 210,
    treasury_asset: "ETH",
    voting_opens_at: null,
    voting_closes_at: null,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  },
];

async function getProposalsAndRole(): Promise<{ proposals: DaoProposal[]; role: UserRole }> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };

    const { data: proposals } = await supabase
      .from("dao_proposals")
      .select("*")
      .order("created_at", { ascending: false });

    return {
      proposals: proposals && proposals.length > 0 ? proposals : FALLBACK_PROPOSALS,
      role: profile?.role ?? "executive",
    };
  } catch {
    return { proposals: FALLBACK_PROPOSALS, role: "executive" };
  }
}

export default async function DaoGovernancePage() {
  const { proposals, role } = await getProposalsAndRole();

  return (
    <Web3Provider>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Hybrid DAO Governance</h1>
          <p className="mt-1 text-sm text-slate-500">
            Proposal voting is blockchain-mocked for governance review; the government compliance
            override can halt any proposal regardless of vote outcome.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            {proposals.map((proposal) => (
              <DaoProposalCard key={proposal.id} proposal={proposal} role={role} />
            ))}
          </div>
          <TreasuryPanel />
        </div>
      </div>
    </Web3Provider>
  );
}
