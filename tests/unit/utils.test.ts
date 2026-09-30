import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("lets a later conflicting Tailwind utility win over an earlier one", () => {
    expect(cn("p-6 pb-3", "pb-0")).toBe("p-6 pb-0");
  });

  it("resolves conflicting background-color utilities to the last one", () => {
    expect(cn("bg-slate-900/40", "bg-black/30")).toBe("bg-black/30");
  });
});
