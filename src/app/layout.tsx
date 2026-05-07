import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditAI — Free AI Spend Audit for Startups",
  description: "Find out exactly how much you're overspending on AI tools. Free audit in 2 minutes. No login required.",
  openGraph: {
    title: "AuditAI — Free AI Spend Audit",
    description: "Instantly audit your AI tool spend. Find savings on Cursor, Claude, ChatGPT, Copilot and more.",
    url: process.env.NEXT_PUBLIC_BASE_URL ?? "https://auditai.vercel.app",
    siteName: "AuditAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditAI — Free AI Spend Audit",
    description: "Find out how much you're overspending on AI tools. Free, 2 minutes, no login.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
