import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold"
        >
          AuditAI
        </Link>

        <Link
          href="/audit"
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          Start Audit
        </Link>
      </div>
    </nav>
  );
}