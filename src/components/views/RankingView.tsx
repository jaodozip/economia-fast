import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useRef } from "react";
import { RankingItem } from "../../types/dashboard";
import { formatNumber } from "../../utils/format";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { SectionTitle } from "../SectionTitle";

type Props = {
  data: RankingItem[];
  loading: boolean;
  empty: boolean;
  error: string | null;
  showFull?: boolean;
};

export const RankingView = ({ data, loading, empty, error, showFull }: Props) => {
  const full = Boolean(showFull);
  const sorted = useMemo(() => [...data].sort((a, b) => b.quantidade - a.quantidade), [data]);
  const maxValue = Math.max(1, ...sorted.map((item) => item.quantidade));
  const shortName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const first = parts[0];
    const last = parts[parts.length - 1];
    return `${first} ${last.charAt(0)}.`;
  };
  const listRef = useRef<HTMLDivElement>(null);
  useAutoScroll(listRef, !full);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className={`col-span-12 ${full ? "" : "xl:col-span-7"} space-y-4`}>
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle>RANKING DE PRODUÇÃO</SectionTitle>
            {error ? (
              <div className="text-xs text-red-600">{error}</div>
            ) : loading ? (
              <div className="text-xs text-zinc-400">Carregando dados...</div>
            ) : empty ? (
              <div className="text-xs text-zinc-400">Nenhum dado retornado pela API.</div>
            ) : null}
          </div>
          <div
            ref={listRef}
            className={`${full ? "max-h-none overflow-visible pr-0" : "max-h-[420px] overflow-auto pr-2 scrollbar-thin"}`}
          >
            <div className="space-y-3">
              {sorted.map((item, index) => {
                const rank = index + 1;
                const pct = Math.round((item.quantidade / maxValue) * 100);
                const badge =
                  rank === 1
                    ? "bg-amber-400 text-black"
                    : rank === 2
                    ? "bg-zinc-300 text-black"
                    : rank === 3
                    ? "bg-amber-700 text-white"
                    : "bg-zinc-800 text-zinc-400";
                return (
                  <div key={`${item.funcionario}-${index}`} className="rounded-xl bg-zinc-950/60 border border-zinc-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${badge}`}>
                          {rank}
                        </div>
                        <div>
                          <div className="text-sm text-white">{item.funcionario}</div>
                          <div className="text-xs text-zinc-500">{formatNumber(item.quantidade)} unidades</div>
                        </div>
                      </div>
                      <div className="text-sm text-emerald-400 font-semibold">{formatNumber(item.quantidade)}</div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {full ? null : (
        <div className="col-span-12 xl:col-span-5">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <SectionTitle>Distribuição por Funcionário</SectionTitle>
          <div className="h-[360px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted.slice(0, 6)} layout="vertical">
                <XAxis type="number" tick={{ fill: "#71717a" }} axisLine={{ stroke: "#27272a" }} />
                <YAxis
                  dataKey="funcionario"
                  type="category"
                  tick={{ fill: "#71717a" }}
                  width={110}
                  tickFormatter={(value) => shortName(String(value))}
                />
                <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
                <Bar dataKey="quantidade" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
