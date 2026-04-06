import { useMemo, useState } from "react";
import { Dashboard, DataSource, Panel } from "../types/dashboard";
import { createId } from "../utils/id";
import { PanelEditor } from "./PanelEditor";

const makePanel = (): Panel => ({
  id: createId(),
  nome: "Novo painel",
  titulo: "",
  tipo: "metas",
  dataSourceId: null,
  fieldMappings: [],
  config: {
    metas: {
      showColchoes: true,
      showBox: true,
      colchaoRealizado: "",
      colchaoMeta: "",
      boxRealizado: "",
      boxMeta: "",
      produtosAtraso: "",
      usarMetasManuais: false,
      metaManualColchao: 0,
      metaManualBox: 0,
    },
  },
});

type Props = {
  dashboard: Dashboard;
  setDashboard: (next: Dashboard) => void;
  dataSources: DataSource[];
  empresas: { id: string; nome: string }[];
};

export const DashboardEditor = ({ dashboard, setDashboard, dataSources, empresas }: Props) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(dashboard.panels[0]?.id ?? null);
  const selectedPanel = useMemo(
    () => dashboard.panels.find((p) => p.id === selectedPanelId) || dashboard.panels[0] || null,
    [dashboard.panels, selectedPanelId]
  );

  const updatePanel = (panel: Panel) => {
    setDashboard({
      ...dashboard,
      panels: dashboard.panels.map((p) => (p.id === panel.id ? panel : p)),
    });
  };

  const addPanel = () => {
    const next = makePanel();
    setDashboard({ ...dashboard, panels: [...dashboard.panels, next] });
    setSelectedPanelId(next.id);
  };

  const removePanel = (id: string) => {
    const nextPanels = dashboard.panels.filter((p) => p.id !== id);
    setDashboard({ ...dashboard, panels: nextPanels });
    setSelectedPanelId(nextPanels[0]?.id ?? null);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6">
        <div className="text-sm text-zinc-400 uppercase tracking-widest">Configurações gerais</div>
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Nome do dashboard</label>
            <input
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.nome}
              onChange={(e) => setDashboard({ ...dashboard, nome: e.target.value })}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Empresa</label>
            <select
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.empresa}
              onChange={(e) => setDashboard({ ...dashboard, empresa: e.target.value })}
            >
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Tipo do dashboard</label>
            <select
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.tipoDashboard}
              onChange={(e) => setDashboard({ ...dashboard, tipoDashboard: e.target.value as Dashboard["tipoDashboard"] })}
            >
              <option value="metas">METAS</option>
              <option value="ranking">RANKING</option>
              <option value="cargas">CARGAS</option>
              <option value="misto">MISTO</option>
            </select>
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="text-xs text-zinc-500">Logo URL</label>
            <input
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.logoUrl}
              onChange={(e) => setDashboard({ ...dashboard, logoUrl: e.target.value })}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className="text-xs text-zinc-500">Polling (s)</label>
            <input
              type="number"
              min={5}
              max={60}
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.pollingSeconds}
              onChange={(e) => setDashboard({ ...dashboard, pollingSeconds: Number(e.target.value) })}
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <label className="text-xs text-zinc-500">Rotação (s)</label>
            <input
              type="number"
              min={8}
              max={60}
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dashboard.rotationSeconds}
              onChange={(e) => setDashboard({ ...dashboard, rotationSeconds: Number(e.target.value) })}
            />
          </div>
          <div className="col-span-12 md:col-span-3 flex items-end">
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={dashboard.rotationEnabled}
                onChange={(e) => setDashboard({ ...dashboard, rotationEnabled: e.target.checked })}
              />
              Rotação automática
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400 uppercase tracking-widest">Painéis</div>
              <button className="text-xs text-emerald-400" onClick={addPanel}>
                + Adicionar painel
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.panels.map((panel) => (
                <button
                  key={panel.id}
                  className={`w-full text-left rounded-xl border px-3 py-3 ${
                    panel.id === selectedPanelId ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/60"
                  }`}
                  onClick={() => setSelectedPanelId(panel.id)}
                >
                  <div className="text-sm text-white">{panel.nome}</div>
                  <div className="text-xs text-zinc-500">{panel.tipo.toUpperCase()} · {panel.titulo || "Sem título"}</div>
                  <div
                    className="mt-2 text-xs text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePanel(panel.id);
                    }}
                  >
                    Remover
                  </div>
                </button>
              ))}
              {dashboard.panels.length === 0 ? (
                <div className="text-xs text-zinc-500">Nenhum painel configurado.</div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-8">
          {selectedPanel ? (
            <PanelEditor panel={selectedPanel} setPanel={updatePanel} dataSources={dataSources} pollingSeconds={dashboard.pollingSeconds} />
          ) : (
            <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 text-zinc-400">
              Selecione um painel para editar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
