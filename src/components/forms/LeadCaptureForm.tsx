"use client";

import { useState } from "react";

interface Props {
  totalSavings: number;
  auditId: string;
  onSubmitted: () => void;
}

export default function LeadCaptureForm({ totalSavings, auditId, onSubmitted }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState(""); // spam trap
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return; // bot caught
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, totalSavings, auditId }),
      });
      if (!res.ok) throw new Error("Failed");
      onSubmitted();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name (optional)"
          className="rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Your role (optional)"
          className="rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-black text-white py-4 font-semibold hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send me the report →"}
      </button>
      <p className="text-xs text-gray-400 text-center">No spam. Unsubscribe anytime.</p>
    </form>
  );
}
