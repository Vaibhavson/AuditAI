# AuditAI — Free AI Spend Audit for Startups

AuditAI helps startup founders and engineering managers instantly audit their AI tool spend — finding overspend, right-sizing plans, and surfacing cheaper alternatives. It's free, requires no login, and takes 2 minutes.

**Live:** https://auditai.vercel.app

## Screenshots

### Home page screenshots
![Home Page](./screenshots/landingpage.png)

### Form page screenshot
![Form page](./screenshots/formpage.png)

### Results page screenshots
![Results page](./screenshots/resultspage1.png)
![Results page 2](./screenshots/resultspage2.png)

### Recieved male screenshots
![Recieved male](./screenshots/mailpage.png)

### Data stored(Database) screenshot
![Database](./screenshots/database.png)

## Quick Start

```bash
git clone https://github.com/Vaibhavson/AuditAI.git
cd AuditAI
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
<!-- ANTHROPIC_API_KEY=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 -->
NEXT_PUBLIC_SUPABASE_URL=https://cujltrtontydeuddhsqy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1amx0cnRvbnR5ZGV1ZGRoc3F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE0MzA3NywiZXhwIjoyMDkzNzE5MDc3fQ.NVLUmnMNY6lwcZLkS4HppBoO-q2FFKC305mSsWYCb6U
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1amx0cnRvbnR5ZGV1ZGRoc3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDMwNzcsImV4cCI6MjA5MzcxOTA3N30.hEozp3a1CaZCA5lxZv2VF1jEuCCZFf8PL6c_cUsxVr8
RESEND_API_KEY=re_GfS49MYt_DwQoQb1m2R1U8yKyDmdb7Xvv
NEXT_PUBLIC_BASE_URL=https://your-deployed-url.vercel.app
```

## Deploy

```bash
vercel
```


## Decisions

**1. Next.js over plain React**
Next.js gives us API routes (for Anthropic, Supabase, Resend) in the same repo without a separate backend. This keeps deployment simple — one Vercel project instead of two services.

**2. Hardcoded audit rules instead of AI**
The audit math (plan comparisons, seat pricing) uses deterministic rules, not LLM calls. A finance person needs to trust the numbers — AI-generated savings figures would be unpredictable and hard to verify. AI is used only for the summary paragraph where nuance adds value.

**3. Supabase over Firebase**
Supabase has a Postgres-compatible REST API that works without an SDK — one less dependency, easier to audit. Firebase requires the Firebase SDK which adds bundle weight.

**4. localStorage for form persistence**
Form state persists across reloads via localStorage. This is simpler than server-side sessions and appropriate for a tool with no login requirement.

**5. Honeypot over hCaptcha for abuse protection**
hCaptcha adds friction for real users. A honeypot hidden field catches most bots silently with zero UX impact. Rate limiting (3 submissions/IP/hour) handles the rest.
