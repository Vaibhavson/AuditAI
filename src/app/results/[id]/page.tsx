"use client";

import { useEffect, useState } from "react";
import { Recommendation } from "@/types/audit";
import ResultsHero from "@/components/results/ResultsHero";
import RecommendationCard from "@/components/results/ReccomendationCard";
import SummaryCard from "@/components/results/SummaryCard";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

export default function ResultsPage() {
  const [results, setResults] = useState<Recommendation[]>([]);
  const [auditId, setAuditId] = useState<string>("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const totalSavings = results.reduce((acc, r) => acc + r.savings, 0);
  const annualSavings = totalSavings * 12;

  useEffect(() => {
    const stored = localStorage.getItem("audit-results");
    const payload = localStorage.getItem("audit-payload");
    if (stored) setResults(JSON.parse(stored));
    if (payload) {
      const p = JSON.parse(payload);
      setAuditId(p.id ?? "");
    }
  }, []);

  useEffect(() => {
    if (results.length === 0) return;
    generateSummary();
  }, [results]);

  async function generateSummary() {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results }),
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch {
      // Fallback summary
      const toolCount = results.length;
      const savingTools = results.filter((r) => r.savings > 0).length;
      setSummary(
        `Your audit covers ${toolCount} AI tool${toolCount !== 1 ? "s" : ""}. ` +
        (totalSavings > 0
          ? `We found $${totalSavings}/month ($${annualSavings}/year) in potential savings across ${savingTools} tool${savingTools !== 1 ? "s" : ""}. The biggest wins come from right-sizing plans to your actual team size and use case. Acting on these recommendations could meaningfully reduce your AI spend without any loss in capability.`
          : `Your current AI stack looks well-optimized. You're on plans that match your team size and use case — no obvious overspend detected. Check back as your team grows or new tools launch.`)
      );
    } finally {
      setSummaryLoading(false);
    }
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/results/${auditId}`
    : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied!");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero */}
        <ResultsHero savings={totalSavings} annualSavings={annualSavings} />

        {/* AI Summary */}
        <SummaryCard summary={summaryLoading ? "Generating your personalised summary..." : summary} />

        {/* Per-tool breakdown */}
        <div className="space-y-6">
          {results.map((item, index) => (
            <RecommendationCard key={index} item={item} />
          ))}
        </div>

        {/* Credex CTA for high savers */}
        {totalSavings >= 500 && (
          <div className="rounded-3xl bg-black p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">You could save ${totalSavings}/mo</h3>
            <p className="text-gray-300 mb-6">Credex sources discounted AI credits from companies that over-forecast. Get the same models at 20–30% less.</p>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer"
              className="inline-block rounded-2xl bg-white text-black px-8 py-3 font-semibold hover:bg-gray-100">
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {/* Email capture */}
        {!leadSubmitted ? (
          <div className="rounded-3xl border bg-white p-8">
            <h3 className="text-xl font-bold mb-2">Get this report in your inbox</h3>
            <p className="text-gray-500 mb-6 text-sm">We'll also notify you when new savings apply to your stack.</p>
            <LeadCaptureForm
              totalSavings={totalSavings}
              auditId={auditId}
              onSubmitted={() => setLeadSubmitted(true)}
            />
          </div>
        ) : (
          <div className="rounded-3xl border bg-green-50 p-8 text-center">
            <p className="text-green-700 font-semibold">✓ Report sent! Check your inbox.</p>
          </div>
        )}

        {/* Share */}
        <div className="rounded-3xl border bg-white p-8">
          <h3 className="text-xl font-bold mb-2">Share this audit</h3>
          <p className="text-gray-500 text-sm mb-4">Your personal details are stripped — only tools and savings numbers are public.</p>
          <div className="flex gap-3">
            <input readOnly value={shareUrl} className="flex-1 rounded-xl border p-3 text-sm bg-gray-50" />
            <button onClick={copyLink} className="rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold hover:bg-gray-900">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
