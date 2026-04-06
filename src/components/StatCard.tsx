import { formatNumber } from "../utils/format";

type Props = {
  label: string;
  value: number;
  highlight?: "red" | "emerald" | "amber";
};

export const StatCard = ({ label, value, highlight }: Props) => {
  const color =
    highlight === "red"
      ? "text-red-600"
      : highlight === "amber"
      ? "text-amber-400"
      : "text-emerald-500";
  return (
    <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4">
      <div className="text-xs text-zinc-500 tracking-widest uppercase">{label}</div>
      <div className={`text-3xl font-semibold ${color}`}>{formatNumber(value)}</div>
    </div>
  );
};
