"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { DaoProposal, UserRole } from "@/lib/types/database";

const STATUS_VARIANT: Record<DaoProposal["status"], "default" | "emerald" | "danger" | "neutral" | "violet"> = {
  draft: "neutral",
  active: "default",
  passed: "emerald",
  rejected: "danger",
  executed: "violet",
  overridden: "danger",
};

export function DaoProposalCard({ proposal, role }: { proposal: DaoProposal; role: UserRole }) {
  const [current, setCurrent] = useState(proposal);
  const [isPending, startTransition] = useTransition();
  const [voted, setVoted] = useState(false);

  const total = current.votes_for + current.votes_against;
  const forPct = total > 0 ? Math.round((current.votes_for / total) * 100) : 0;

  const canOverride = role === "government" || role === "admin";

  const vote = (support: boolean) => {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("dao_votes")
        .insert({ proposal_id: current.id, voter_id: user.id, support, weight: 1 });

      if (!error) {
        setCurrent((p) => ({
          ...p,
          votes_for: p.votes_for + (support ? 1 : 0),
          votes_against: p.votes_against + (support ? 0 : 1),
        }));
        setVoted(true);
      }
    });
  };

  const toggleOverride = () => {
    startTransition(async () => {
      const supabase = createClient();
      const nextValue = !current.gov_override_active;
      const { error } = await supabase
        .from("dao_proposals")
        .update({
          gov_override_active: nextValue,
          status: nextValue ? "overridden" : current.status,
          gov_override_reason: nextValue ? "National security compliance hold." : null,
        })
        .eq("id", current.id);

      if (!error) {
        setCurrent((p) => ({
          ...p,
          gov_override_active: nextValue,
          status: nextValue ? "overridden" : p.status,
        }));
      }
    });
  };

  return (
    <Card className="border-slate-800 bg-black/30">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{current.title}</CardTitle>
          <CardDescription className="mt-1">{current.description}</CardDescription>
        </div>
        <Badge variant={STATUS_VARIANT[current.status]}>{current.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {current.gov_override_active && (
          <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <div>
              <p className="font-medium">Government Compliance Override Active</p>
              <p className="text-xs opacity-80">{current.gov_override_reason}</p>
            </div>
          </div>
        )}

        <div>
          <div className="mb-1.5 flex justify-between text-xs text-slate-400">
            <span>For: {current.votes_for}</span>
            <span>Against: {current.votes_against}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-emerald transition-all" style={{ width: `${forPct}%` }} />
          </div>
        </div>

        {current.treasury_amount && (
          <p className="text-xs text-slate-500">
            Requested allocation:{" "}
            <span className="font-mono text-slate-300">
              {current.treasury_amount} {current.treasury_asset ?? "ETH"}
            </span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button size="sm" variant="outline" disabled={voted || isPending || current.gov_override_active} onClick={() => vote(true)}>
            {isPending ? "Voting…" : "Vote For"}
          </Button>
          <Button size="sm" variant="outline" disabled={voted || isPending || current.gov_override_active} onClick={() => vote(false)}>
            Vote Against
          </Button>

          {canOverride && (
            <Button size="sm" variant="destructive" disabled={isPending} onClick={toggleOverride} className="ml-auto">
              {current.gov_override_active ? "Lift Override" : "Apply Compliance Override"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
