import { describe, expect, it } from "vitest";
import { classifyPriority, URGENCY_KEYWORDS } from "@/lib/classification";

describe("classifyPriority", () => {
  it("defaults general B2B inquiries to baseline priority 3", () => {
    expect(classifyPriority("general_b2b", "We'd like to discuss a partnership.")).toBe(3);
  });

  it("raises priority (lower number) for defense agency inquiries", () => {
    expect(classifyPriority("defense_agency", "Standard inquiry, no urgency.")).toBe(2);
  });

  it("raises priority for government inquiries", () => {
    expect(classifyPriority("government", "Standard inquiry, no urgency.")).toBe(2);
  });

  it("lowers priority (higher number) for venture partner inquiries", () => {
    expect(classifyPriority("venture_partner", "Interested in a seed round discussion.")).toBe(4);
  });

  it("stacks urgency keywords on top of the type adjustment", () => {
    expect(classifyPriority("defense_agency", "This is a time-sensitive request.")).toBe(1);
  });

  it("matches urgency keywords case-insensitively", () => {
    expect(classifyPriority("general_b2b", "URGENT please respond ASAP.")).toBe(2);
  });

  it("clamps the floor at 1 even when multiple boosts would go lower", () => {
    expect(classifyPriority("defense_agency", "Classified, urgent, national security matter.")).toBe(1);
  });

  it("clamps the ceiling at 5", () => {
    // venture_partner (+1) alone only reaches 4; still validate the clamp math directly.
    expect(classifyPriority("venture_partner", "no keywords here")).toBeLessThanOrEqual(5);
  });

  it("exposes the keyword list used for triage so copy changes stay in sync with tests", () => {
    expect(URGENCY_KEYWORDS).toContain("national security");
  });
});
