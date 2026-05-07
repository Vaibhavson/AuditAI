"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { runAudit } from "@/lib/auditEngine";
import { AuditFormData, ToolInput, UseCase } from "@/types/audit";
import { saveFormData, loadFormData } from "@/utils/localStorage";

const TOOLS = ["cursor","copilot","claude","chatgpt","anthropic-api","openai-api","gemini","windsurf"];

const PLANS: Record<string, string[]> = {
  cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  copilot: ["Individual", "Business", "Enterprise"],
  claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API Direct"],
  chatgpt: ["Plus", "Team", "Enterprise", "API Direct"],
  "anthropic-api": ["API Direct"],
  "openai-api": ["API Direct"],
  gemini: ["Pro", "Ultra", "API"],
  windsurf: ["Free", "Pro", "Teams", "Enterprise"],
};

const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API Direct",
  "openai-api": "OpenAI API Direct",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

const USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"];

const emptyTool = (): ToolInput => ({ tool: "cursor", plan: "Pro", spend: 0, seats: 1 });

export default function AuditForm() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<UseCase>("mixed");
  const [tools, setTools] = useState<ToolInput[]>([emptyTool()]);

  useEffect(() => {
    const saved = loadFormData();
    if (saved) { setTeamSize(saved.teamSize); setUseCase(saved.useCase); setTools(saved.tools); }
  }, []);

  useEffect(() => { saveFormData({ teamSize, useCase, tools }); }, [teamSize, useCase, tools]);

  function updateTool(index: number, field: keyof ToolInput, value: string | number) {
    setTools((prev) => {
      const updated = [...prev];
      if (field === "tool") {
        updated[index] = { ...updated[index], tool: value as string, plan: PLANS[value as string]?.[0] ?? "Pro" };
      } else if (field === "plan") {
        updated[index] = { ...updated[index], plan: value as string };
      } else {
        updated[index] = { ...updated[index], [field]: Number(value) };
      }
      return updated;
    });
  }

  function addTool() { setTools((prev) => [...prev, emptyTool()]); }
  function removeTool(index: number) { setTools((prev) => prev.filter((_, i) => i !== index)); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData: AuditFormData = { teamSize, useCase, tools };
    const results = runAudit(formData);
    const auditId = crypto.randomUUID();
    const auditPayload = { id: auditId, results, formData: { teamSize, useCase, toolCount: tools.length }, createdAt: new Date().toISOString() };
    localStorage.setItem("audit-results", JSON.stringify(results));
    localStorage.setItem("audit-payload", JSON.stringify(auditPayload));
    router.push(`/results/${auditId}`);
  }

  return (
    <section className="pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-3xl font-bold">Run Your AI Spend Audit</h2>
          <p className="mb-8 text-gray-500">Free. No login required. Takes 2 minutes.</p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Team Size</label>
                <input type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} placeholder="e.g. 5" className="rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Primary Use Case</label>
                <select value={useCase} onChange={(e) => setUseCase(e.target.value as UseCase)} className="rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-black">
                  {USE_CASES.map((uc) => (<option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your AI Tools</h3>
              {tools.map((tool, index) => (
                <div key={index} className="relative rounded-2xl border bg-gray-50 p-6 space-y-4">
                  {tools.length > 1 && (<button type="button" onClick={() => removeTool(index)} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 text-sm">✕ Remove</button>)}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Tool</label>
                      <select value={tool.tool} onChange={(e) => updateTool(index, "tool", e.target.value)} className="rounded-xl border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-black">
                        {TOOLS.map((t) => (<option key={t} value={t}>{TOOL_LABELS[t]}</option>))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Plan</label>
                      <select value={tool.plan} onChange={(e) => updateTool(index, "plan", e.target.value)} className="rounded-xl border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-black">
                        {(PLANS[tool.tool] ?? []).map((p) => (<option key={p} value={p}>{p}</option>))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Monthly Spend ($)</label>
                      <input type="number" min={0} value={tool.spend || ""} onChange={(e) => updateTool(index, "spend", e.target.value)} placeholder="e.g. 200" className="rounded-xl border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Seats / Licenses</label>
                      <input type="number" min={1} value={tool.seats || ""} onChange={(e) => updateTool(index, "seats", e.target.value)} placeholder="e.g. 5" className="rounded-xl border bg-white p-3 focus:outline-none focus:ring-2 focus:ring-black" required />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTool} className="w-full rounded-2xl border-2 border-dashed border-gray-300 py-4 text-gray-500 hover:border-black hover:text-black transition-colors">
                + Add Another Tool
              </button>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-black py-4 text-white text-lg font-semibold hover:bg-gray-900 transition-colors">
              Generate Free Audit →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
