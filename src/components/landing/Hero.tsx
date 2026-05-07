import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex min-h-[90vh] items-center justify-center px-6">
      <div className="max-w-5xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-green-600">
          AI Spend Audit Platform
        </p>

        <h1 className="mb-6 text-6xl font-bold leading-tight">
          Stop Burning Money On AI Subscriptions
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
          Audit your Cursor, Claude, ChatGPT, Gemini and
          Copilot stack instantly.
        </p>

        <Link
          href="/audit"
          className="rounded-2xl bg-black px-8 py-4 text-lg text-white"
        >
          Start Free Audit
        </Link>
      </div>
    </section>
  );
}