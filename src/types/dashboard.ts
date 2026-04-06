export type Empresa = { id: string; nome: string };

export type TipoDashboard = "metas" | "ranking" | "cargas" | "misto";

export type PanelType =
  | "metas"
  | "ranking"
  | "cargas"
  | "cards"
  | "tabela"
  | "grafico_barra"
  | "grafico_linha";

export type AuthMethod = "none" | "bearer" | "basic" | "apikey";

export type HeaderItem = { id: string; key: string; value: string };

export type CookieItem = { id: string; value: string };

export type AuthConfig = {
  method: AuthMethod;
  bearerToken?: string;
  basicUser?: string;
  basicPass?: string;
  apiKeyName?: string;
  apiKeyValue?: string;
  apiKeyIn?: "header" | "query";
};

export type DataSource = {
  id: string;
  nome: string;
  tipo: "REST" | "GraphQL" | "Custom";
  url: string;
  auth: AuthConfig;
  tlsSelfSigned: boolean;
  tlsClientAuth: boolean;
  tlsSkipVerify: boolean;
  headers: HeaderItem[];
  cookies: CookieItem[];
  timeoutSeconds: number;
  queryString: string;
  isDefault: boolean;
};

export type PanelFieldMap = {
  id: string;
  nome: string;
  jsonPath: string;
  sourceType: "JSONPath";
  type: "string" | "number" | "boolean" | "date" | "auto";
  alias: string;
};

export type PanelConfigMetas = {
  showColchoes: boolean;
  showBox: boolean;
  colchaoRealizado: string;
  colchaoMeta: string;
  boxRealizado: string;
  boxMeta: string;
  produtosAtraso: string;
  usarMetasManuais: boolean;
  metaManualColchao: number;
  metaManualBox: number;
};

export type PanelConfigRanking = {
  funcionario: string;
  quantidade: string;
  mostrarCompleto?: boolean;
};

export type PanelConfigCargas = {
  lote: string;
  carga: string;
  pendente: string;
  atraso: string;
  descricao: string;
  ordenacao?: "atrasadas_primeiro" | "somente_atrasadas" | "maior_pendente" | "menor_pendente";
};

export type PanelConfig = {
  metas?: PanelConfigMetas;
  ranking?: PanelConfigRanking;
  cargas?: PanelConfigCargas;
};

export type Panel = {
  id: string;
  nome: string;
  titulo: string;
  tipo: PanelType;
  dataSourceId: string | null;
  fieldMappings: PanelFieldMap[];
  config: PanelConfig;
  ordem?: number;
};

export type Dashboard = {
  id: string;
  nome: string;
  empresa: string;
  tipoDashboard: TipoDashboard;
  logoUrl: string;
  rotationSeconds: number;
  rotationEnabled: boolean;
  pollingSeconds: number;
  panels: Panel[];
};

export type KPIBlock = {
  label: string;
  realizado: number;
  meta: number;
};

export type KPIData = {
  colchao: KPIBlock;
  box: KPIBlock;
  realizadoTotal: number;
  metaTotal: number;
  eficiencia: number;
  produtosAtraso: number;
  desempenhoGlobal: number;
};

export type RankingItem = { funcionario: string; quantidade: number };

export type LoadsItem = {
  lote: string;
  carga: string;
  pendente: number;
  atraso: string;
  descricao: string;
};
