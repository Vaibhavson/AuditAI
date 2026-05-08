# Metrics

## North Star Metric

**Qualified consultations booked per week**

Why: This is the only metric that directly maps to Credex revenue. "Audits completed" is vanity — someone completing an audit who saves $20/month is not the same as someone saving $800/month who books a call. The North Star filters for the latter.

DAU would be wrong here — this is a tool people use once a quarter when they're reviewing budgets, not daily.

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate** (form submitted → results page viewed)
Target: >40%. If people drop off on the form, the friction is too high or the value prop isn't clear enough on the landing page.

**2. High-savings audit rate** (% of audits showing >$500/mo savings)
Target: >15%. If too low, either our pricing data is stale or users are already well-optimised. Drives whether the Credex CTA even surfaces.

**3. Email capture rate** (results page → email submitted)
Target: >25%. This is the lead — no email means no follow-up. If this is low, the results page isn't valuable enough or the email ask is too early.

## What to Instrument First

1. **Audit form submission** — is the form being completed or abandoned?
2. **Results page load** — did the redirect work? Is the page rendering?
3. **Email form submission + success/failure** — is lead capture working?
4. **Consultation CTA clicks** — how many >$500 users click the Credex link?

Simple implementation: `console.log` to Vercel logs initially, then move to PostHog or Plausible once volume justifies it.

## Pivot Trigger

If after 500 audits:
- Email capture rate < 10% → results page isn't delivering enough value, redesign the output
- High-savings rate < 5% → pricing data is stale or targeting wrong users, refresh data and revisit GTM
- Consultation booking rate < 2% of high-savings audits → Credex CTA placement or copy is wrong, A/B test the CTA
- Zero repeat visits → tool is one-and-done, consider adding a "re-audit" reminder email at 90 days
