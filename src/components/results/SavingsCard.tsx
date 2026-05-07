interface Props {
  title: string;
  amount: number;
}

export default function SavingsCard({
  title,
  amount,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-gray-500">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">
        ${amount}
      </h2>
    </div>
  );
}