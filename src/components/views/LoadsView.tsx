import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useRef } from "react";
import { LoadsItem } from "../../types/dashboard";
import { formatNumber } from "../../utils/format";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { SectionTitle } from "../SectionTitle";

type Props = {
  data: LoadsItem[];
  loading: boolean;
  empty: boolean;
  error: string | null;
};

export const LoadsView = ({ data, loading, empty, error }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  useAutoScroll(listRef);
  const summary = useMemo(() => {
    const atrasadas = data.filter((i) => String(i.atraso).toUpperCase() === "SIM").length;
    const pendentes = data.filter((i) => Number(i.pendente || 0) > 0).length;
    return [
      { name: "Pendentes (cargas)", v: pendentes },
      { name: "Atrasadas", v: atrasadas },
      { name: "Cargas", v: data.length },
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-8">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle>EXPEDIÇÃO E CARGAS</SectionTitle>
            {error ? (
              <div className="text-xs text-red-600">{error}</div>
            ) : loading ? (
              <div className="text-xs text-zinc-400">Carregando dados...</div>
            ) : empty ? (
              <div className="text-xs text-zinc-400">Nenhum dado retornado pela API.</div>
            ) : null}
          </div>
          <div ref={listRef} className="max-h-[420px] overflow-auto pr-2 scrollbar-thin">
            <div className="grid grid-cols-5 text-xs text-zinc-500 uppercase tracking-widest px-2 pb-3 border-b border-zinc-800">
              <div>LOTE</div>
              <div>CARGA</div>
              <div>PENDENTE</div>
              <div>STATUS</div>
              <div>DESCRIÇÃO</div>
            </div>
            <div className="space-y-3 mt-3">
              {data.map((item, index) => {
                const atraso = String(item.atraso).toUpperCase();
                const atrasado = atraso === "SIM";
                return (
                  <div key={`${item.lote}-${index}`} className="grid grid-cols-5 gap-2 items-center rounded-xl bg-zinc-950/60 border border-zinc-800 px-3 py-3">
                    <div className="text-sm text-white">{item.lote}</div>
                    <div className="text-sm text-zinc-300">{item.carga}</div>
                    <div className="text-sm text-zinc-300">{formatNumber(item.pendente)}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${atrasado ? "bg-red-600 text-white" : "bg-emerald-500 text-black"}`}>
                        {atrasado ? "ATRASADA" : "NO PRAZO"}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-400">{item.descricao}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <SectionTitle>Resumo de Cargas</SectionTitle>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary}>
                <XAxis dataKey="name" tick={{ fill: "#71717a" }} axisLine={{ stroke: "#27272a" }} />
                <YAxis tick={{ fill: "#71717a" }} axisLine={{ stroke: "#27272a" }} />
                <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
                <Bar dataKey="v" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
