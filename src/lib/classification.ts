import type { InquiryType } from "@/lib/types/database";

// Lightweight automated triage flags high-priority partnership types and
// urgency keywords so staff see time-sensitive inquiries first.
export const URGENCY_KEYWORDS = ["urgent", "classified", "national security", "time-sensitive", "deadline"];

/** Lower number = higher priority. Clamped to [1, 5]. */
export function classifyPriority(inquiryType: InquiryType, message: string): number {
  let priority = 3;
  if (inquiryType === "defense_agency" || inquiryType === "government") priority -= 1;
  if (inquiryType === "venture_partner") priority += 1;
  const lowered = message.toLowerCase();
  if (URGENCY_KEYWORDS.some((kw) => lowered.includes(kw))) priority -= 1;
  return Math.min(5, Math.max(1, priority));
}
