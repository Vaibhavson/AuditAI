const features = [
  {
    title: "Instant Savings Analysis",
    description:
      "Find where your AI stack is overspending in seconds.",
  },

  {
    title: "Smart Recommendations",
    description:
      "Get actionable plan downgrade and vendor suggestions.",
  },

  {
    title: "Shareable Reports",
    description:
      "Generate public audit reports with clean visuals.",
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold">
            Everything You Need To Optimize AI Spend
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-white p-8"
            >
              <h3 className="mb-4 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}