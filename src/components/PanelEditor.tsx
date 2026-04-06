import { useMemo, useState } from "react";
import { DataSource, Panel, PanelConfigCargas, PanelConfigRanking, PanelType } from "../types/dashboard";
import { getAliasOptions } from "../utils/mapping";
import { JsonMappingTable } from "./JsonMappingTable";
import { KpiFieldConfig } from "./KpiFieldConfig";
import { useDashboardData } from "../hooks/useDashboardData";

type Props = {
  panel: Panel;
  setPanel: (next: Panel) => void;
  dataSources: DataSource[];
  pollingSeconds: number;
};

const getDefaultConfig = (tipo: PanelType): Panel["config"] => {
  if (tipo === "metas") {
    return {
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
    };
  }
  if (tipo === "ranking") {
    return { ranking: { funcionario: "", quantidade: "", mostrarCompleto: false } };
  }
  if (tipo === "cargas") {
    return { cargas: { lote: "", carga: "", pendente: "", atraso: "", descricao: "" } };
  }
  return {};
};

export const PanelEditor = ({ panel, setPanel, dataSources, pollingSeconds }: Props) => {
  const [tab, setTab] = useState<"geral" | "fonte" | "campos" | "regras">("geral");
  const dataSource = dataSources.find((ds) => ds.id === panel.dataSourceId) || null;
  const { payload, mappedRows, refetch } = useDashboardData(dataSource, panel.fieldMappings, pollingSeconds);
  const aliasOptions = useMemo(() => getAliasOptions(panel.fieldMappings), [panel.fieldMappings]);

  const updatePanel = (patch: Partial<Panel>) => setPanel({ ...panel, ...patch });

  const updateRanking = (patch: Partial<PanelConfigRanking>) =>
    updatePanel({ config: { ...panel.config, ranking: { ...(panel.config.ranking || {}), ...patch } } });

  const updateCargas = (patch: Partial<PanelConfigCargas>) =>
    updatePanel({ config: { ...panel.config, cargas: { ...(panel.config.cargas || {}), ...patch } } });

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-white">Editor de Painel</div>
          <div className="text-xs text-zinc-500">
            {panel.nome || "Painel sem nome"} · {dataSource ? dataSource.nome : "Data Source não selecionado"}
          </div>
        </div>
        <button className="text-xs text-zinc-400 hover:text-white" onClick={refetch}>
          Atualizar pré-visualização
        </button>
      </div>

      <div className="flex gap-3 text-xs uppercase tracking-widest">
        {[
          { id: "geral", label: "Geral" },
          { id: "fonte", label: "Fonte de Dados" },
          { id: "campos", label: "Campos" },
          { id: "regras", label: "Regras" },
        ].map((item) => (
          <button
            key={item.id}
            className={`px-3 py-2 rounded-lg border ${
              tab === item.id ? "border-emerald-500 text-emerald-400" : "border-zinc-800 text-zinc-500"
            }`}
            onClick={() => setTab(item.id as typeof tab)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "geral" ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Nome do painel</label>
            <input
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={panel.nome}
              onChange={(e) => updatePanel({ nome: e.target.value })}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Título do painel</label>
            <input
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={panel.titulo}
              onChange={(e) => updatePanel({ titulo: e.target.value })}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="text-xs text-zinc-500">Tipo do painel</label>
            <select
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={panel.tipo}
              onChange={(e) =>
                updatePanel({
                  tipo: e.target.value as PanelType,
                  config: getDefaultConfig(e.target.value as PanelType),
                })
              }
            >
              <option value="metas">Metas</option>
              <option value="ranking">Ranking</option>
              <option value="cargas">Cargas</option>
              <option value="cards">Cards</option>
              <option value="tabela">Tabela</option>
              <option value="grafico_barra">Gráfico de barras</option>
              <option value="grafico_linha">Gráfico de linha</option>
            </select>
          </div>
        </div>
      ) : null}

      {tab === "fonte" ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <label className="text-xs text-zinc-500">Data Source vinculado</label>
            <select
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={panel.dataSourceId ?? ""}
              onChange={(e) => updatePanel({ dataSourceId: e.target.value || null })}
            >
              <option value="">Selecionar fonte</option>
              {dataSources.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-12 md:col-span-6 text-xs text-zinc-500 mt-6">
            A fonte de dados é reutilizável. Atualize aqui para trocar o painel sem afetar outros.
          </div>
        </div>
      ) : null}

      {tab === "campos" ? (
        <JsonMappingTable
          mapping={panel.fieldMappings}
          setMapping={(next) => updatePanel({ fieldMappings: next })}
          rawPreview={payload}
          mappedPreview={mappedRows}
          onSave={() => updatePanel({ fieldMappings: panel.fieldMappings })}
        />
      ) : null}

      {tab === "regras" ? (
        <div className="space-y-6">
          {panel.tipo === "metas" ? (
            <KpiFieldConfig panel={panel} setPanel={setPanel} />
          ) : null}
          {panel.tipo === "ranking" ? (
            <div className="space-y-3">
              <div className="text-xs text-zinc-500 uppercase tracking-widest">Regras do painel de ranking</div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <input
                      type="checkbox"
                      checked={panel.config.ranking?.mostrarCompleto ?? false}
                      onChange={(e) => updateRanking({ mostrarCompleto: e.target.checked })}
                    />
                    Mostrar ranking completo na tela
                  </label>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="text-xs text-zinc-500">Funcionário</label>
                  <select
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    value={panel.config.ranking?.funcionario ?? ""}
                    onChange={(e) => updateRanking({ funcionario: e.target.value })}
                  >
                    <option value="">Selecionar</option>
                    {aliasOptions.map((alias) => (
                      <option key={alias} value={alias}>
                        {alias}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="text-xs text-zinc-500">Quantidade</label>
                  <select
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    value={panel.config.ranking?.quantidade ?? ""}
                    onChange={(e) => updateRanking({ quantidade: e.target.value })}
                  >
                    <option value="">Selecionar</option>
                    {aliasOptions.map((alias) => (
                      <option key={alias} value={alias}>
                        {alias}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : null}

          {panel.tipo === "cargas" ? (
            <div className="space-y-3">
              <div className="text-xs text-zinc-500 uppercase tracking-widest">Regras do painel de cargas</div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <label className="text-xs text-zinc-500">Ordenação</label>
                  <select
                    className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                    value={panel.config.cargas?.ordenacao ?? "atrasadas_primeiro"}
                    onChange={(e) => updateCargas({ ordenacao: e.target.value as PanelConfigCargas["ordenacao"] })}
                  >
                    <option value="atrasadas_primeiro">Atrasadas primeiro</option>
                    <option value="somente_atrasadas">Somente atrasadas</option>
                    <option value="maior_pendente">Maior pendente</option>
                    <option value="menor_pendente">Menor pendente</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                {[
                  { key: "lote", label: "Lote" },
                  { key: "carga", label: "Carga" },
                  { key: "pendente", label: "Pendente" },
                  { key: "atraso", label: "Atraso" },
                  { key: "descricao", label: "Descrição" },
                ].map((field) => (
                  <div key={field.key} className="col-span-12 md:col-span-6">
                    <label className="text-xs text-zinc-500">{field.label}</label>
                    <select
                      className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                      value={(panel.config.cargas as Record<string, string> | undefined)?.[field.key] ?? ""}
                      onChange={(e) => updateCargas({ [field.key]: e.target.value } as Partial<PanelConfigCargas>)}
                    >
                      <option value="">Selecionar</option>
                      {aliasOptions.map((alias) => (
                        <option key={alias} value={alias}>
                          {alias}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {panel.tipo !== "metas" && panel.tipo !== "ranking" && panel.tipo !== "cargas" ? (
            <div className="text-sm text-zinc-400">
              Nenhuma regra específica disponível para este tipo de painel.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
