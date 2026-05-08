# Prompts

## AI Summary Prompt (used in /api/summary/route.ts)

```
You are a concise financial analyst. Write a ~100-word plain-English summary 
of this AI spend audit for a startup founder or engineering manager. Be specific 
about the savings opportunities. Do not use bullet points. Do not use headers. 
Just a single paragraph.

Audit data:
- Total tools audited: ${results.length}
- Total potential monthly savings: $${totalSavings}
- Tools with savings: ${savingTools.map(r => `${r.tool} ($${r.savings}/mo — ${r.recommendation})`).join(", ")}
- Tools already optimal: ${results.filter(r => r.savings === 0).map(r => r.tool).join(", ") || "none"}

Write the paragraph now:
```

## Why I wrote it this way

**"Financial analyst" persona:** Grounds the tone in specificity and numbers. Without this, the model writes generic marketing copy like "you could save money by optimising your stack."

**"Do not use bullet points / headers":** The summary renders inline on the results page next to a structured breakdown. Bullets inside bullets would look broken. Plain prose was the right format.

**Specific data injection:** Passing exact tool names, savings amounts, and recommendations forces the model to be specific rather than generic. Early versions without this produced summaries like "your stack has room for improvement" — useless.

**~100 words constraint:** The results page has limited space. Without a word constraint, the model wrote 300+ word essays.

## What I tried that didn't work

**Version 1 — No persona, no data:**
> "Summarise this AI audit and suggest improvements."

Result: Generic output, no numbers, not useful.

**Version 2 — Asking for bullet points:**
> "Give me 3 bullet points summarising the audit."

Result: Fine content but wrong format for the UI — looked bad next to the structured cards.

**Version 3 — Too much instruction:**
> "Write a summary. Make it friendly. Use simple words. Be encouraging. Mention Credex. Keep it under 100 words. Don't be negative."

Result: Sycophantic, watered-down output. Removing the tone instructions and trusting the financial analyst persona worked better.

## What I don't use AI for

The audit engine itself (plan comparisons, savings calculations) uses hardcoded deterministic rules. A finance person needs to trust the numbers — if the model calculated "$340 savings" based on vibes, that would undermine the entire product. Knowing when not to use AI is as important as knowing when to use it.
