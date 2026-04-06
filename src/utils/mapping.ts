import {
  KPIData,
  LoadsItem,
  PanelConfigCargas,
  PanelConfigMetas,
  PanelConfigRanking,
  PanelFieldMap,
  RankingItem,
} from "../types/dashboard";
import { percentOf } from "./format";
import { evalJsonPath } from "./jsonpath";

export const extractMappedRows = (payload: unknown, mapping: PanelFieldMap[]): Record<string, unknown>[] => {
  if (!payload || mapping.length === 0) return [];
  const results = mapping.map((m) => ({
    field: m,
    values: evalJsonPath(payload, m.jsonPath),
  }));
  const maxLen = Math.max(1, ...results.map((r) => r.values.length || 0));

  return Array.from({ length: maxLen }, (_, idx) => {
    const row: Record<string, unknown> = {};
    results.forEach((r) => {
      const key = r.field.alias || r.field.nome;
      const value =
        r.values.length === 0
          ? undefined
          : r.values.length === 1
          ? r.values[0]
          : r.values[idx];
      row[key] = value;
    });
    return row;
  });
};

export const getAliasOptions = (mapping: PanelFieldMap[]) =>
  mapping
    .map((m) => (m.alias || m.nome).trim())
    .filter(Boolean);

export const buildKpiFromPanel = (
  mappedRows: Record<string, unknown>[],
  config: PanelConfigMetas | undefined
): KPIData => {
  const row = mappedRows?.[0] || {};
  const getNum = (alias: string | undefined) => (alias ? Number((row as Record<string, unknown>)?.[alias] ?? 0) : 0);
  const useManual = config?.usarMetasManuais === true;
  const colchaoReal = getNum(config?.colchaoRealizado);
  const colchaoMeta = useManual ? Number(config?.metaManualColchao ?? 0) : getNum(config?.colchaoMeta);
  const boxReal = getNum(config?.boxRealizado);
  const boxMeta = useManual ? Number(config?.metaManualBox ?? 0) : getNum(config?.boxMeta);
  const produtosAtraso = getNum(config?.produtosAtraso);
  const showColchoes = config?.showColchoes ?? true;
  const showBox = config?.showBox ?? true;
  const realizadoTotal = (showColchoes ? colchaoReal : 0) + (showBox ? boxReal : 0);
  const metaTotal = (showColchoes ? colchaoMeta : 0) + (showBox ? boxMeta : 0);
  const eficiencia = percentOf(realizadoTotal, metaTotal);
  const desempenhoGlobal = Math.max(0, Math.min(100, eficiencia));
  return {
    colchao: { label: "COLCHÕES", realizado: colchaoReal, meta: colchaoMeta },
    box: { label: "BOX", realizado: boxReal, meta: boxMeta },
    realizadoTotal,
    metaTotal,
    eficiencia,
    produtosAtraso,
    desempenhoGlobal,
  };
};

export const parseRankingFromPanel = (
  mappedRows: Record<string, unknown>[],
  config: PanelConfigRanking | undefined
): RankingItem[] =>
  mappedRows
    .map((r) => {
      const row = r as Record<string, unknown>;
      return {
        funcionario: String(
          config?.funcionario ? row[config.funcionario] : row.funcionario ?? row.nome ?? row.operador ?? "—"
        ),
        quantidade: Number(
          config?.quantidade ? row[config.quantidade] : row.quantidade ?? row.qtde ?? row.total ?? 0
        ),
      };
    })
    .filter((r) => r.funcionario !== "—");

export const parseLoadsFromPanel = (
  mappedRows: Record<string, unknown>[],
  config: PanelConfigCargas | undefined
): LoadsItem[] =>
  mappedRows.map((r) => {
    const row = r as Record<string, unknown>;
    return {
      lote: String(config?.lote ? row[config.lote] : row.lote ?? row.num_lote_pro ?? "—"),
      carga: String(config?.carga ? row[config.carga] : row.carga ?? "—"),
      pendente: Number(config?.pendente ? row[config.pendente] : row.pendente ?? row.qtde_pendente ?? 0),
      atraso: String(config?.atraso ? row[config.atraso] : row.atraso ?? "NAO"),
      descricao: String(config?.descricao ? row[config.descricao] : row.descricao ?? "—"),
    };
  });
