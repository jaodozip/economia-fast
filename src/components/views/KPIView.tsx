import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import { KPIBlock, KPIData, PanelConfigMetas } from "../../types/dashboard";
import { clamp, formatNumber, percentOf } from "../../utils/format";
import { AnimatedNumber } from "../AnimatedNumber";
import { SectionTitle } from "../SectionTitle";
import { StatCard } from "../StatCard";

type Props = {
  data: KPIData;
  config?: PanelConfigMetas;
  loading: boolean;
  empty: boolean;
  error: string | null;
};

export const KPIView = ({ data, config, loading, empty, error }: Props) => {
  const showColchoes = config?.showColchoes ?? true;
  const showBox = config?.showBox ?? true;
  const items = [showColchoes ? data.colchao : null, showBox ? data.box : null].filter(Boolean) as KPIBlock[];
  const single = items.length === 1;
  const realizadoTotal = data.realizadoTotal;
  const metaTotal = data.metaTotal;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 xl:col-span-8 space-y-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle>METAS DE PRODUÇÃO</SectionTitle>
            {error ? (
              <div className="text-xs text-red-600">{error}</div>
            ) : loading ? (
              <div className="text-xs text-zinc-400">Carregando dados...</div>
            ) : empty ? (
              <div className="text-xs text-zinc-400">Nenhum dado retornado pela API.</div>
            ) : null}
          </div>
          <div className={`space-y-6 ${single ? "flex flex-col justify-center min-h-[340px]" : ""}`}>
            {items.map((kpi) => {
              const pct = percentOf(kpi.realizado, kpi.meta);
              const completed = kpi.realizado >= kpi.meta && kpi.meta > 0;
              return (
                <div
                  key={kpi.label}
                  className={`rounded-xl bg-zinc-950/60 border border-zinc-800 p-6 ${single ? "min-h-[220px]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-zinc-400 tracking-widest uppercase">{kpi.label}</div>
                    {completed ? <div className="text-amber-400 text-xl">🏆</div> : null}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500 uppercase tracking-widest">Progresso</div>
                      <div className="mt-2 w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${completed ? "bg-amber-400" : "bg-emerald-500"}`}
                          style={{ width: `${clamp(pct, 0, 100)}%` }}
                        />
                      </div>
                      <div className={`mt-3 text-4xl font-semibold ${completed ? "text-amber-400" : "text-emerald-500"}`}>
                        {pct}%
                      </div>
                    </div>
                    <div className="flex items-end gap-4">
                      <AnimatedNumber value={kpi.realizado} className="text-7xl text-white font-semibold" />
                      <div className="text-4xl text-zinc-500">/ {formatNumber(kpi.meta)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <SectionTitle red>DESEMPENHO GLOBAL</SectionTitle>
          <div className="mt-6 grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { name: "T1", v: Math.max(0, data.desempenhoGlobal - 8) },
                      { name: "T2", v: Math.max(0, data.desempenhoGlobal - 5) },
                      { name: "T3", v: Math.max(0, data.desempenhoGlobal - 2) },
                      { name: "T4", v: data.desempenhoGlobal },
                    ]}
                  >
                    <XAxis dataKey="name" tick={{ fill: "#71717a" }} axisLine={{ stroke: "#27272a" }} />
                    <YAxis tick={{ fill: "#71717a" }} axisLine={{ stroke: "#27272a" }} />
                    <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
                    <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="REALIZADO TOTAL" value={realizadoTotal} highlight="emerald" />
                <StatCard label="META TOTAL" value={metaTotal} highlight="amber" />
                <StatCard label="EFICIÊNCIA" value={data.eficiencia} highlight={data.eficiencia >= 100 ? "amber" : "emerald"} />
                <StatCard label="PRODUTOS EM ATRASO" value={data.produtosAtraso} highlight="red" />
              </div>
              <div className="mt-4 rounded-xl bg-zinc-950/60 border border-zinc-800 p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-widest">Resumo Visual</div>
                <div className="h-[140px] mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Realizado", v: realizadoTotal },
                        { name: "Meta", v: metaTotal },
                        { name: "Eficiência", v: data.eficiencia },
                      ]}
                    >
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
        </div>
      </div>

      <div className="col-span-12 xl:col-span-4 space-y-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <SectionTitle>Resumo do Turno</SectionTitle>
          <div className="mt-4 text-6xl font-semibold text-white">{percentOf(realizadoTotal, metaTotal)}%</div>
          <div className="mt-2 text-sm text-zinc-500">Eficiência consolidada do período atual.</div>
          <div className="mt-6 w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${realizadoTotal >= metaTotal && metaTotal > 0 ? "bg-amber-400" : "bg-emerald-500"}`}
              style={{ width: `${clamp(percentOf(realizadoTotal, metaTotal), 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
          <SectionTitle red>PRODUTOS EM ATRASO</SectionTitle>
          <div className="mt-6 text-6xl font-semibold text-red-600">{data.produtosAtraso}</div>
          <div className="mt-2 text-sm text-zinc-500">Itens críticos aguardando expedição.</div>
        </div>
      </div>
    </div>
  );
};
