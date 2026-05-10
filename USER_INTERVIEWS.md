# User Interviews

Three conversations with potential users — software engineers and data professionals who actively use and pay for AI tools.

---

## Interview 1 — Shreyan Bhattacharya

**Role:** Software Development Engineer, Honeywell
**Company Stage:** Large enterprise (personal AI spend, not company-reimbursed)
**Interview Date:** 2026-05-09
**Duration:** ~10 minutes

### What They Said

Shreyan uses Claude, ChatGPT, Copilot, Cursor, and OpenAI APIs across personal projects and work. His monthly spend ranges widely depending on side project activity.

**Direct Quotes:**
- "I use AI tools like Claude, ChatGPT, Copilot, Cursor and sometimes OpenAI APIs for development and productivity. Roughly it comes out to around 10,000–30,000 rupees a month depending on side projects as well as usage."
- "Most of the uses are personal right now, though some of it overlaps with my work."
- "Yeah, sometimes I feel that I am overpaying but didn't fully utilize the resources."
- "I review the monthly bills which I am spending on AI tools to make sure that I'm on the right plans."
- "I do not have any issue in changing my tool if any other company provides the same speed at free of cost or cheaper."

### Most Surprising Thing They Said

The spend range — 10,000 to 30,000 rupees/month ($120–$360) — was much higher than I expected for a single individual. He's paying for multiple overlapping tools simultaneously without a clear sense of which one is actually delivering value. The variability itself (3x swing month to month) suggests he has no systematic way to track utilization.

### What It Changed in My Design

This made me add a "utilization" angle to the audit — not just "are you on the right plan" but "are you actually using what you're paying for." It also confirmed that the audit needs to handle multi-tool overlap (e.g., both Copilot and Cursor for coding) as a specific savings pattern.

---

## Interview 2 — Soumya Thakur

**Role:** Data Scientist
**Company Stage:** Individual contributor, mix of personal and team use
**Interview Date:** 2026-05-10
**Duration:** ~10 minutes

### What They Said

Soumya uses OpenAI and ChatGPT for long-text analysis and Cursor for workflows. Spends roughly 2,000 rupees/month (~$24). Uses AI daily — it's core to her workflow, not occasional.

**Direct Quotes:**
- "It has become part of my daily workflow — especially for research, coding assistance and various things."
- "I use OpenAI and ChatGPT for long-text analysis, while for workflows I prefer Cursor."
- "Roughly I spend 2,000 rupees a month."
- "Sometimes I think that I am overpaying."
- "I definitely consider switching but at the same time reliability also matters a lot. If any tool gives the same speed with better content at lesser price or free of cost, I will switch."

### Most Surprising Thing They Said

She said she thinks she's on the right plans — but she's paying for both OpenAI API direct and ChatGPT simultaneously for what sounds like the same use case (long-text analysis). She didn't recognize this as overlap when I asked follow-up questions. She assumed being on "the right plan" meant she wasn't overspending, when the real issue was tool duplication.

### What It Changed in My Design

This confirmed that the audit engine needs to flag duplicate tool categories — not just plan mismatches. Someone paying for both ChatGPT Plus and OpenAI API direct is likely doing the same tasks twice. I added logic to surface this as a specific recommendation type.

---

## Interview 3 — Vaishali Parmar

**Role:** SDE-1, Google
**Company Stage:** Large enterprise (personal spend, not reimbursed)
**Interview Date:** 2026-05-11
**Duration:** ~10 minutes

### What They Said

Vaishali uses OpenAI, ChatGPT, Cursor, and Claude for debugging, boilerplate generation, and long-context technical tasks. Spends 5,000–6,000 rupees/month (~$60–72). Reviews her plans actively.

**Direct Quotes:**
- "As an SDE-1 at Google, I prefer to use AI tools for most tasks — debugging, generating boilerplate code and so on."
- "I use OpenAI and ChatGPT, and sometimes Cursor for workflows. I've also tried Anthropic Claude for long-context tasks and technical explanations."
- "I spend around 5,000–6,000 rupees a month on AI subscriptions."
- "Sometimes I feel that I'm overpaying because a lot of products give me similar results and there is no difference among them."
- "If somebody offers me better plans, I prefer to switch quickly."

### Most Surprising Thing They Said

She works at Google — which means she likely has access to Gemini through her work account at no personal cost. When I asked if she used Gemini, she said she hadn't considered it for personal use even though it might cover some of her use cases. A user with free enterprise-tier access to one model was still paying out of pocket for competitors. This is a gap the audit tool doesn't currently surface — "you may already have access to X through your employer."

### What It Changed in My Design

Added a note in the results page copy suggesting users check whether their employer provides AI tool access before purchasing personal subscriptions. Also reinforced that the "already optimal" state should never just say "you're fine" — it should suggest checking for free alternatives including employer-provided tools.