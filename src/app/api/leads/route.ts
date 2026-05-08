import { NextRequest, NextResponse } from "next/server";

// Rate limit: simple in-memory store (use Redis/Upstash for production)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3; // max 3 submissions per IP per hour
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return true;
  rateLimitMap.set(ip, [...timestamps, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const { email, company, role, totalSavings, auditId } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // 1. Store in Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          email,
          company: company || null,
          role: role || null,
          total_savings: totalSavings,
          audit_id: auditId,
          created_at: new Date().toISOString(),
          high_savings: totalSavings >= 500,
        }),
      });
    }
  } catch (err) {
    console.error("Supabase error:", err);
    // Don't fail the request if DB is down
  }

  // 2. Send transactional email via Resend
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "AuditAI <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL ?? email,
          subject: `Your AI Spend Audit — ${totalSavings > 0 ? `$${totalSavings}/mo in savings found` : "You're spending well"}`,
          html: `
            <h2>Your AI Spend Audit Results</h2>
            <p>Hi${company ? ` from ${company}` : ""},</p>
            <p>${totalSavings > 0
              ? `We found <strong>$${totalSavings}/month ($${totalSavings * 12}/year)</strong> in potential savings in your AI stack.`
              : "Your current AI stack looks well-optimised — no major savings opportunities found."
            }</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/results/${auditId}">View your full audit report →</a></p>
            ${totalSavings >= 500
              ? `<p>Given the size of your savings opportunity, a Credex consultant will reach out shortly to walk you through how discounted AI credits could help.</p>`
              : ""
            }
            <p style="color:#999;font-size:12px;">AuditAI by Credex · credex.rocks</p>
          `,
        }),
      });
    }
  } catch (err) {
    console.error("Email error:", err);
  }

  return NextResponse.json({ ok: true });
}
