import { describe, it, expect } from "vitest";
import { runAudit } from "../../src/lib/auditEngine";

describe("Audit Engine", () => {
  it("flags Team plan for 2 users as overkill and suggests downgrade", () => {
    const results = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [{ tool: "claude", plan: "Team", spend: 60, seats: 2 }],
    });
    expect(results[0].savings).toBeGreaterThan(0);
    expect(results[0].recommendation.toLowerCase()).toContain("downgrade");
  });

  it("flags Enterprise plan for 3 users and suggests Business/Team", () => {
    const results = runAudit({
      teamSize: 3,
      useCase: "mixed",
      tools: [{ tool: "copilot", plan: "Enterprise", spend: 117, seats: 3 }],
    });
    expect(results[0].savings).toBeGreaterThan(0);
    expect(results[0].recommendation.toLowerCase()).toContain("downgrade");
  });

  it("flags high ChatGPT spend as Credex credits opportunity", () => {
    const results = runAudit({
      teamSize: 20,
      useCase: "mixed",
      tools: [{ tool: "chatgpt", plan: "Team", spend: 600, seats: 20 }],
    });
    expect(results[0].savings).toBeGreaterThan(0);
    expect(results[0].recommendation.toLowerCase()).toContain("credex");
  });

  it("flags Claude Max for small team as overkill", () => {
    const results = runAudit({
      teamSize: 2,
      useCase: "writing",
      tools: [{ tool: "claude", plan: "Max", spend: 200, seats: 2 }],
    });
    expect(results[0].savings).toBe(160);
    expect(results[0].recommendation.toLowerCase()).toContain("pro");
  });

  it("flags Cursor Business for 2 devs and suggests Pro", () => {
    const results = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [{ tool: "cursor", plan: "Business", spend: 80, seats: 2 }],
    });
    expect(results[0].savings).toBe(40);
    expect(results[0].recommendation.toLowerCase()).toContain("pro");
  });

  it("returns zero savings for already-optimal setup", () => {
    const results = runAudit({
      teamSize: 1,
      useCase: "coding",
      tools: [{ tool: "cursor", plan: "Pro", spend: 20, seats: 1 }],
    });
    expect(results[0].savings).toBe(0);
  });

  it("handles multiple tools and sums savings correctly", () => {
    const results = runAudit({
      teamSize: 2,
      useCase: "coding",
      tools: [
        { tool: "claude", plan: "Team", spend: 60, seats: 2 },
        { tool: "cursor", plan: "Business", spend: 80, seats: 2 },
      ],
    });
    expect(results.length).toBe(2);
    const total = results.reduce((acc, r) => acc + r.savings, 0);
    expect(total).toBeGreaterThan(0);
  });
});
