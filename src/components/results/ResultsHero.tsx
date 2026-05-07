interface Props { savings: number; annualSavings: number; }

export default function ResultsHero({ savings, annualSavings }: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 p-10 text-center">
      <p className="text-sm font-medium text-green-700 uppercase tracking-widest mb-3">Your AI Spend Audit</p>
      {savings > 0 ? (
        <>
          <h1 className="text-6xl font-extrabold text-green-700 mb-2">${savings}<span className="text-3xl">/mo</span></h1>
          <p className="text-2xl text-green-600 font-semibold">${annualSavings.toLocaleString()} potential annual savings</p>
          <p className="mt-4 text-gray-500 text-sm">Based on your current AI tool stack and team size</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">You&apos;re spending well ✓</h1>
          <p className="text-gray-500">No significant savings opportunities detected in your current stack.</p>
        </>
      )}
    </div>
  );
}
