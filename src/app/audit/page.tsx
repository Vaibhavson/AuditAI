import Navbar from "@/components/landing/Navbar";
import AuditForm from "@/components/forms/AuditForm";

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="py-20">
        <AuditForm />
      </div>
    </main>
  );
}