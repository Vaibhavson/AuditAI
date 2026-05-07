import { AuditFormData, Recommendation, UseCase } from "@/types/audit";

// Per-seat pricing ($/user/month) — verified May 2026
// Sources in PRICING_DATA.md
const SEAT_PRICE: Record<string, Record<string, number>> = {
  cursor:        { Hobby: 0, Pro: 20, Business: 40, Enterprise: 40 },
  copilot:       { Individual: 10, Business: 19, Enterprise: 39 },
  claude:        { Free: 0, Pro: 20, Max: 100, Team: 30, Enterprise: 60, "API Direct": 0 },
  chatgpt:       { Plus: 20, Team: 30, Enterprise: 60, "API Direct": 0 },
  "anthropic-api": { "API Direct": 0 },
  "openai-api":  { "API Direct": 0 },
  gemini:        { Pro: 20, Ultra: 40, API: 0 },
  windsurf:      { Free: 0, Pro: 15, Teams: 30, Enterprise: 60 },
};

const TOOL_LABELS: Record<string, string> = {
  cursor: "Cursor", copilot: "GitHub Copilot", claude: "Claude",
  chatgpt: "ChatGPT", "anthropic-api": "Anthropic API", "openai-api": "OpenAI API",
  gemini: "Gemini", windsurf: "Windsurf",
};

// Cheaper alternatives by use case
const ALTERNATIVES: Record<UseCase, Record<string, { tool: string; plan: string; reason: string }>> = {
  coding: {
    copilot:  { tool: "cursor", plan: "Pro", reason: "Cursor Pro ($20/seat) has stronger code completion and chat than Copilot Business ($19/seat) with similar pricing — but check if your team uses VS Code exclusively." },
    chatgpt:  { tool: "claude", plan: "Pro", reason: "Claude Pro ($20/seat) outperforms ChatGPT Plus ($20/seat) on long-context code review and is same price." },
    gemini:   { tool: "cursor", plan: "Pro", reason: "Cursor Pro is purpose-built for coding; Gemini Pro is a general assistant at the same price point." },
  },
  writing: {
    cursor:   { tool: "claude", plan: "Pro", reason: "Claude Pro ($20/seat) is better suited for writing tasks than Cursor, which is a coding tool." },
    copilot:  { tool: "claude", plan: "Pro", reason: "GitHub Copilot is designed for code — Claude Pro gives significantly better writing output at similar cost." },
    windsurf: { tool: "claude", plan: "Pro", reason: "Windsurf is a coding IDE assistant; Claude Pro is purpose-built for writing workflows." },
  },
  research: {
    cursor:   { tool: "claude", plan: "Pro", reason: "Claude Pro has a 200k token context window ideal for research; Cursor is optimised for code." },
    windsurf: { tool: "claude", plan: "Pro", reason: "Windsurf is a coding assistant — Claude Pro is far better for research and long-document analysis." },
    copilot:  { tool: "chatgpt", plan: "Plus", reason: "ChatGPT Plus with browsing/web search is more useful for active research than GitHub Copilot." },
  },
  data: {
    cursor:   { tool: "chatgpt", plan: "Plus", reason: "ChatGPT Plus with Advanced Data Analysis (code interpreter) handles data tasks better than Cursor." },
    windsurf: { tool: "chatgpt", plan: "Plus", reason: "ChatGPT Plus data analysis features outperform a coding IDE assistant for data workflows." },
  },
  mixed: {},
};

interface AuditRule {
  condition: (tool: { tool: string; plan: string; spend: number; seats: number }, teamSize: number, useCase: UseCase) => boolean;
  recommendation: (tool: { tool: string; plan: string; spend: number; seats: number }, teamSize: number) => { action: string; savings: number; reason: string };
}

const RULES: AuditRule[] = [
  // Rule 1: Team plan for ≤2 people is overkill
  {
    condition: (t) => t.plan === "Team" && t.seats <= 2,
    recommendation: (t) => {
      const label = TOOL_LABELS[t.tool] ?? t.tool;
      const proPrice = SEAT_PRICE[t.tool]?.["Pro"] ?? SEAT_PRICE[t.tool]?.["Individual"] ?? 20;
      const teamPrice = SEAT_PRICE[t.tool]?.["Team"] ?? 30;
      const savings = (teamPrice - proPrice) * t.seats;
      return {
        action: `Downgrade to Pro plan`,
        savings: Math.max(savings, 0),
        reason: `${label} Team plan adds collaboration features irrelevant for ≤2 users. Pro gives the same AI capabilities at $${proPrice}/seat vs $${teamPrice}/seat.`,
      };
    },
  },
  // Rule 2: Enterprise plan for small team (<5)
  {
    condition: (t) => t.plan === "Enterprise" && t.seats < 5,
    recommendation: (t) => {
      const label = TOOL_LABELS[t.tool] ?? t.tool;
      const businessPrice = SEAT_PRICE[t.tool]?.["Business"] ?? SEAT_PRICE[t.tool]?.["Team"] ?? 30;
      const enterprisePrice = SEAT_PRICE[t.tool]?.["Enterprise"] ?? 60;
      const savings = (enterprisePrice - businessPrice) * t.seats;
      return {
        action: `Downgrade to Business/Team plan`,
        savings: Math.max(savings, 0),
        reason: `Enterprise plans are built for SSO, audit logs, and compliance — unnecessary for teams under 5. Business tier gives same AI access at $${businessPrice}/seat vs $${enterprisePrice}/seat.`,
      };
    },
  },
  // Rule 3: Paying retail for chatgpt/claude when Credex credits available at scale
  {
    condition: (t) => ["chatgpt", "claude"].includes(t.tool) && t.spend >= 500,
    recommendation: (t) => {
      const label = TOOL_LABELS[t.tool] ?? t.tool;
      const savings = Math.round(t.spend * 0.25);
      return {
        action: `Switch to Credex discounted credits`,
        savings,
        reason: `At $${t.spend}/mo spend on ${label}, you qualify for Credex wholesale credits — typically 20–30% below retail pricing for the same underlying model access.`,
      };
    },
  },
  // Rule 4: Claude Max for small team is overkill
  {
    condition: (t) => t.tool === "claude" && t.plan === "Max" && t.seats <= 3,
    recommendation: (t) => {
      const savings = (100 - 20) * t.seats;
      return {
        action: `Downgrade to Claude Pro`,
        savings,
        reason: `Claude Max ($100/seat) gives 5× the usage limits of Pro ($20/seat). For teams ≤3 people, Pro limits are rarely hit in practice — saving $${savings}/mo.`,
      };
    },
  },
  // Rule 5: Cursor Business for solo/pair devs
  {
    condition: (t) => t.tool === "cursor" && t.plan === "Business" && t.seats <= 2,
    recommendation: (t) => {
      const savings = (40 - 20) * t.seats;
      return {
        action: `Downgrade to Cursor Pro`,
        savings,
        reason: `Cursor Business ($40/seat) adds centralised billing and privacy controls — useful at 10+ seats, overkill for ≤2 devs. Pro ($20/seat) gives identical AI capability.`,
      };
    },
  },
  // Rule 6: Copilot Enterprise for non-enterprise
  {
    condition: (t) => t.tool === "copilot" && t.plan === "Enterprise" && t.seats < 10,
    recommendation: (t) => {
      const savings = (39 - 19) * t.seats;
      return {
        action: `Downgrade to Copilot Business`,
        savings,
        reason: `Copilot Enterprise ($39/seat) adds Copilot in GitHub.com UI and custom models — only valuable at scale. Business ($19/seat) covers all IDE completions and chat features.`,
      };
    },
  },
];

export function runAudit(data: AuditFormData): Recommendation[] {
  return data.tools.map((tool) => {
    // Check use-case based alternative first
    const alt = ALTERNATIVES[data.useCase]?.[tool.tool];

    // Then check rules in order — first matching rule wins
    for (const rule of RULES) {
      if (rule.condition(tool, data.teamSize, data.useCase)) {
        const { action, savings, reason } = rule.recommendation(tool, data.teamSize);
        return {
          tool: tool.tool,
          currentSpend: tool.spend,
          recommendedSpend: Math.max(tool.spend - savings, 0),
          savings,
          recommendation: action,
          reason,
          alternativeTool: alt?.tool,
          alternativePlan: alt?.plan,
          alternativeReason: alt?.reason,
        };
      }
    }

    // No structural rule fired — check cross-tool alternative
    if (alt) {
      const altSeatPrice = SEAT_PRICE[alt.tool]?.[alt.plan] ?? 20;
      const currentSeatPrice = SEAT_PRICE[tool.tool]?.[tool.plan] ?? (tool.spend / Math.max(tool.seats, 1));
      const potentialSavings = Math.max((currentSeatPrice - altSeatPrice) * tool.seats, 0);

      return {
        tool: tool.tool,
        currentSpend: tool.spend,
        recommendedSpend: Math.max(tool.spend - potentialSavings, 0),
        savings: potentialSavings,
        recommendation: potentialSavings > 0
          ? `Consider switching to ${TOOL_LABELS[alt.tool]} ${alt.plan}`
          : `Current plan is well-matched for your use case`,
        reason: potentialSavings > 0 ? alt.reason : `Your ${TOOL_LABELS[tool.tool]} ${tool.plan} plan is appropriately sized for a ${data.useCase} team of ${data.teamSize}.`,
        alternativeTool: alt.tool,
        alternativePlan: alt.plan,
        alternativeReason: alt.reason,
      };
    }

    // Truly optimal
    return {
      tool: tool.tool,
      currentSpend: tool.spend,
      recommendedSpend: tool.spend,
      savings: 0,
      recommendation: `You're spending well`,
      reason: `${TOOL_LABELS[tool.tool] ?? tool.tool} ${tool.plan} is appropriate for a ${data.useCase} team of ${data.teamSize}. No obvious savings available at this spend level.`,
    };
  });
}
