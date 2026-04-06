import { useMemo, useState } from "react";
import { Dashboard, DataSource } from "../types/dashboard";
import { createId } from "../utils/id";
import { DashboardEditor } from "./DashboardEditor";

const makeDashboard = (empresaId: string): Dashboard => ({
  id: createId(),
  nome: "Novo dashboard",
  empresa: empresaId,
  tipoDashboard: "misto",
  logoUrl: "",
  rotationSeconds: 12,
  rotationEnabled: true,
  pollingSeconds: 7,
  panels: [],
});

type Props = {
  dashboards: Dashboard[];
  setDashboards: (next: Dashboard[]) => void;
  dataSources: DataSource[];
  empresas: { id: string; nome: string }[];
  onOpenDashboard: (id: string) => void;
};

export const DashboardsPage = ({ dashboards, setDashboards, dataSources, empresas, onOpenDashboard }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(dashboards[0]?.id ?? null);
  const selected = useMemo(
    () => dashboards.find((d) => d.id === selectedId) || dashboards[0] || null,
    [dashboards, selectedId]
  );

  const upsert = (next: Dashboard) => {
    const updated = dashboards.some((d) => d.id === next.id)
      ? dashboards.map((d) => (d.id === next.id ? next : d))
      : [...dashboards, next];
    setDashboards(updated);
    setSelectedId(next.id);
  };

  const remove = (id: string) => {
    const filtered = dashboards.filter((d) => d.id !== id);
    setDashboards(filtered);
    setSelectedId(filtered[0]?.id ?? null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-4 space-y-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400 uppercase tracking-widest">Dashboards</div>
            <button
              className="text-xs text-emerald-400"
              onClick={() => {
                const next = makeDashboard(empresas[0]?.id ?? "");
                setDashboards([...dashboards, next]);
                setSelectedId(next.id);
              }}
            >
              + Criar
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {dashboards.map((dash) => (
              <div
                key={dash.id}
                className={`rounded-xl border px-3 py-3 cursor-pointer ${
                  dash.id === selectedId ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/60"
                }`}
                onClick={() => setSelectedId(dash.id)}
              >
                <div className="text-sm text-white">{dash.nome}</div>
                <div className="text-xs text-zinc-500">
                  {empresas.find((e) => e.id === dash.empresa)?.nome || "Empresa"} · {dash.tipoDashboard.toUpperCase()} · {dash.panels.length} painéis
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    className="text-xs text-emerald-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDashboard(dash.id);
                    }}
                  >
                    Abrir
                  </button>
                  <button
                    className="text-xs text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(dash.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {dashboards.length === 0 ? (
              <div className="text-xs text-zinc-500">Nenhum dashboard cadastrado.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-8">
        {selected ? (
          <DashboardEditor
            dashboard={selected}
            setDashboard={upsert}
            dataSources={dataSources}
            empresas={empresas}
          />
        ) : (
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 text-zinc-400">
            Selecione ou crie um dashboard para editar.
          </div>
        )}
      </div>
    </div>
  );
};
