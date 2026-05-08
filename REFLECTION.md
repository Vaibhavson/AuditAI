# Reflection

## 1. Hardest Bug

The hardest bug was the shareable URL returning 404 for anyone other than the person who ran the audit. My first hypothesis was that the Next.js dynamic route `[id]` wasn't being recognised by Vercel — I checked the deployment logs and the route was fine. Second hypothesis: the results page was trying to read from localStorage, which is empty in a fresh browser session. That was it.

The fix required two parts: first, saving the audit data to Supabase when the results page loads (not just the lead data), and second, making the results page try localStorage first (for the person who just submitted) and fall back to a Supabase fetch by audit ID for anyone opening a shared link. I also had to add a `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable because the client-side fetch to Supabase needs the anon key, not the service role key. The service role key should never be exposed to the browser. Mixing these up was a secondary bug I caught while fixing the first.

## 2. A Decision I Reversed

I initially built the audit results as a server-rendered page — the idea was better SEO and faster initial load. I reversed this mid-week when I realised that the audit data lives in localStorage immediately after submission, and server-rendering would require either passing the data through the URL (too much data, ugly URL) or fetching it from Supabase on every load (adds latency, requires the data to be saved before redirect). Client-side rendering with a localStorage read was simpler, faster for the happy path, and still supported shared URLs via Supabase fallback. The complexity of server rendering wasn't worth it for a tool with no SEO requirement on the results page.

## 3. What I'd Build in Week 2

The single most valuable addition would be a **re-audit reminder system**. Right now the tool is one-and-done. If I emailed every lead at 90 days with "AI pricing has changed — re-run your audit," I'd get repeat visits and a second chance to convert people who weren't ready to book a Credex consultation the first time. Second priority: a **team sharing flow** — right now the shareable URL is passive. I'd add a "Send to your team" button that drafts an email with the results. Third: **benchmark mode** — "your AI spend per developer is $X, companies your size average $Y" — this adds social proof and makes the tool more shareable.

## 4. How I Used AI Tools

I used Claude heavily throughout this project — for generating boilerplate (the initial Next.js component structure, the Supabase REST API calls, the Resend integration), for debugging (pasting error messages and asking what's wrong), and for writing the markdown documentation files.

I did not trust Claude with the audit engine logic itself. The savings calculations and rule conditions needed to be defensible to a finance person — I wrote those rules myself and verified each number against the official pricing pages. Claude suggested a rule early on that would have flagged Gemini Ultra as "overkill" for any team under 10 — but Gemini Ultra is a personal plan, not a per-seat plan, so the comparison was wrong. I caught this because I was reading the actual pricing pages rather than accepting the output.

I also didn't trust Claude with the DEVLOG or USER_INTERVIEWS — those needed to reflect my actual experience, not a plausible-sounding synthetic version of it.

## 5. Self-Rating

**Discipline: 6/10**
Started strong on day 1 but lost half a day to email deliverability rabbit holes that didn't affect the core product.

**Code quality: 7/10**
TypeScript used throughout, sensible component structure, no obvious bugs in the happy path. Would improve: better error boundaries, more explicit loading states.

**Design sense: 6/10**
The UI is clean and functional but not distinctive. The results page does the job but wouldn't get screenshotted and shared unprompted.

**Problem-solving: 7/10**
Debugged the shareable URL bug systematically — formed hypotheses, tested each one, found the root cause. Could have been faster if I'd read the Supabase docs more carefully upfront.

**Entrepreneurial thinking: 7/10**
The GTM and economics sections are specific and grounded in real numbers. The user interviews surfaced a genuine insight I hadn't expected. Would rate higher if I'd done more interviews earlier in the week instead of at the end.
