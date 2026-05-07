interface Props {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  type = "button",
  onClick,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl bg-black px-6 py-3 text-white transition hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}