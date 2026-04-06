import { Dashboard, DataSource, Empresa, LoadsItem, Panel, RankingItem, TipoDashboard } from "../types/dashboard";
import { createId } from "../utils/id";

export const EMPRESAS: Empresa[] = [
  { id: "emp-01", nome: "INDÚSTRIA AURORA" },
  { id: "emp-02", nome: "FÁBRICA NORTE" },
  { id: "emp-03", nome: "PLANTA SUL" },
];

export const TIPOS: TipoDashboard[] = ["metas", "ranking", "cargas", "misto"];

export const MOCK_DATASOURCES: DataSource[] = [
  {
    id: "ds-01",
    nome: "API Produção",
    tipo: "REST",
    url: "",
    auth: { method: "none" },
    tlsSelfSigned: false,
    tlsClientAuth: false,
    tlsSkipVerify: false,
    headers: [],
    cookies: [],
    timeoutSeconds: 10,
    queryString: "",
    isDefault: true,
  },
  {
    id: "ds-02",
    nome: "API Expedição",
    tipo: "REST",
    url: "",
    auth: { method: "none" },
    tlsSelfSigned: false,
    tlsClientAuth: false,
    tlsSkipVerify: false,
    headers: [],
    cookies: [],
    timeoutSeconds: 10,
    queryString: "",
    isDefault: false,
  },
];

const makePanel = (partial: Partial<Panel>): Panel => ({
  id: createId(),
  nome: "",
  titulo: "",
  tipo: "metas",
  dataSourceId: null,
  fieldMappings: [],
  config: {},
  ...partial,
});

export const MOCK_DASHBOARDS: Dashboard[] = [
  {
    id: "dash-01",
    nome: "Produção Diária",
    empresa: EMPRESAS[0].id,
    tipoDashboard: "metas",
    logoUrl: "",
    rotationSeconds: 12,
    rotationEnabled: true,
    pollingSeconds: 7,
    panels: [
      makePanel({
        nome: "Metas",
        titulo: "Metas de Produção",
        tipo: "metas",
        dataSourceId: "ds-01",
        config: {
          metas: {
            showColchoes: true,
            showBox: true,
            colchaoRealizado: "realizado_colchoes",
            colchaoMeta: "meta_colchoes",
            boxRealizado: "realizado_box",
            boxMeta: "meta_box",
            produtosAtraso: "produtos_atraso",
            usarMetasManuais: false,
            metaManualColchao: 0,
            metaManualBox: 0,
          },
        },
      }),
      makePanel({
        nome: "Ranking",
        titulo: "Ranking de Produção",
        tipo: "ranking",
        dataSourceId: "ds-01",
        config: { ranking: { funcionario: "funcionario", quantidade: "quantidade", mostrarCompleto: false } },
      }),
      makePanel({
        nome: "Cargas",
        titulo: "Expedição e Cargas",
        tipo: "cargas",
        dataSourceId: "ds-02",
        config: {
          cargas: {
            lote: "lote",
            carga: "carga",
            pendente: "pendente",
            atraso: "atraso",
            descricao: "descricao",
            ordenacao: "atrasadas_primeiro",
          },
        },
      }),
    ],
  },
];

export const MOCK_METAS = {
  colchao: { label: "COLCHÕES", realizado: 358, meta: 900 },
  box: { label: "BOX", realizado: 220, meta: 500 },
  produtosAtraso: 18,
};

export const MOCK_RANKING: RankingItem[] = [
  { funcionario: "Aline Santos", quantidade: 68 },
  { funcionario: "João Lima", quantidade: 63 },
  { funcionario: "Carlos Rios", quantidade: 59 },
  { funcionario: "Patrícia N.", quantidade: 54 },
  { funcionario: "Marcos T.", quantidade: 51 },
  { funcionario: "Isabela M.", quantidade: 49 },
  { funcionario: "Rafael G.", quantidade: 45 },
  { funcionario: "Sofia A.", quantidade: 42 },
  { funcionario: "Diego P.", quantidade: 38 },
  { funcionario: "Luciana V.", quantidade: 35 },
];

export const MOCK_CARGAS: LoadsItem[] = [
  {
    lote: "L-2026-0317-01",
    carga: "C-8891",
    pendente: 12,
    atraso: "SIM",
    descricao: "Colchão casal - lote crítico",
  },
  {
    lote: "L-2026-0317-02",
    carga: "C-8892",
    pendente: 4,
    atraso: "NAO",
    descricao: "Box solteiro",
  },
  {
    lote: "L-2026-0317-03",
    carga: "C-8894",
    pendente: 9,
    atraso: "SIM",
    descricao: "Colchão king - revisão",
  },
  {
    lote: "L-2026-0317-04",
    carga: "C-8895",
    pendente: 2,
    atraso: "NAO",
    descricao: "Colchão queen",
  },
  {
    lote: "L-2026-0317-05",
    carga: "C-8897",
    pendente: 6,
    atraso: "SIM",
    descricao: "Box queen - reetiquetar",
  },
];
