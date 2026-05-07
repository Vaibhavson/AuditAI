import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { results } = await req.json();

  const totalSavings = results.reduce((acc: number, r: { savings: number }) => acc + r.savings, 0);
  const savingTools = results.filter((r: { savings: number }) => r.savings > 0);

  const prompt = `You are a concise financial analyst. Write a ~100-word plain-English summary of this AI spend audit for a startup founder or engineering manager. Be specific about the savings opportunities. Do not use bullet points. Do not use headers. Just a single paragraph.

Audit data:
- Total tools audited: ${results.length}
- Total potential monthly savings: $${totalSavings}
- Tools with savings: ${savingTools.map((r: { tool: string; savings: number; recommendation: string }) => `${r.tool} ($${r.savings}/mo — ${r.recommendation})`).join(", ")}
- Tools already optimal: ${results.filter((r: { savings: number }) => r.savings === 0).map((r: { tool: string }) => r.tool).join(", ") || "none"}

Write the paragraph now:`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error("API failed");
    const data = await response.json();
    const summary = data.content?.[0]?.text ?? "";
    return NextResponse.json({ summary });
  } catch {
    // Graceful fallback
    const toolCount = results.length;
    const fallback = totalSavings > 0
      ? `Your audit across ${toolCount} AI tools found $${totalSavings}/month ($${totalSavings * 12}/year) in potential savings. The main opportunities are ${savingTools.slice(0, 2).map((r: { tool: string; recommendation: string }) => `${r.tool} (${r.recommendation.toLowerCase()})`).join(" and ")}. These savings come from right-sizing plans to your actual team size and use case — no capability loss required. Acting on all recommendations could meaningfully reduce your recurring AI costs.`
      : `Your audit across ${toolCount} AI tools shows a well-optimised stack. Each tool is appropriately sized for your team and primary use case. No significant savings opportunities were found at your current spend levels. Check back as your team grows or new AI tools enter the market.`;
    return NextResponse.json({ summary: fallback });
  }
}
