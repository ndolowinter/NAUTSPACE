"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { isSuperuserEmail } from "@/lib/types/database";

export interface AdminUserRow {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  organization: string | null;
  created_at: string;
  membershipStatus: string | null;
  trialEndsAt: string | null;
}

const MEMBERSHIP_VARIANT: Record<string, "emerald" | "default" | "danger" | "neutral"> = {
  active: "emerald",
  trial: "default",
  expired: "danger",
  cancelled: "neutral",
};

export function UserSearch({ users }: { users: AdminUserRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or role…"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No users match your search.</p>
        )}
        {filtered.map((u) => (
          <div
            key={u.id}
            className="flex flex-col gap-2 rounded-lg border border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-100">
                {u.full_name ?? "Unnamed"}
                <span className="ml-2 text-xs text-slate-500">{u.email}</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {u.organization ? `${u.organization} · ` : ""}Joined{" "}
                {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="neutral">{u.role}</Badge>
              {isSuperuserEmail(u.email) ? (
                <Badge variant="emerald">lifetime</Badge>
              ) : (
                u.membershipStatus && (
                  <Badge variant={MEMBERSHIP_VARIANT[u.membershipStatus] ?? "neutral"}>
                    {u.membershipStatus}
                    {u.membershipStatus === "trial" && u.trialEndsAt
                      ? ` · ends ${new Date(u.trialEndsAt).toLocaleDateString()}`
                      : ""}
                  </Badge>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
