interface Props {
  summary: string;
}

export default function SummaryCard({
  summary,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold">
        AI Summary
      </h2>

      <p className="leading-7 text-gray-700">
        {summary}
      </p>
    </div>
  );
}