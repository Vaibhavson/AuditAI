interface Props {
  item: any;
}

export default function RecommendationCard({
  item,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold capitalize">
          {item.tool}
        </h2>

        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          Save ${item.savings}
        </span>
      </div>

      <p className="mt-4 text-gray-600">
        {item.reason}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">
            Current Spend
          </p>

          <h3 className="text-2xl font-bold">
            ${item.currentSpend}
          </h3>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Recommended
          </p>

          <h3 className="text-2xl font-bold">
            ${item.recommendedSpend}
          </h3>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Action
          </p>

          <h3 className="text-lg font-semibold">
            {item.recommendation}
          </h3>
        </div>
      </div>
    </div>
  );
}