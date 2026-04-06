import { Dashboard, DataSource, Empresa } from "../types/dashboard";

const STORAGE_KEYS = {
  dataSources: "industrial-data-sources",
  dashboards: "industrial-dashboards",
  empresas: "industrial-empresas",
};

export const loadDataSources = (): DataSource[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dataSources);
    if (!raw) return [];
    return JSON.parse(raw) as DataSource[];
  } catch {
    return [];
  }
};

export const saveDataSources = (dataSources: DataSource[]) => {
  localStorage.setItem(STORAGE_KEYS.dataSources, JSON.stringify(dataSources));
};

export const loadDashboards = (): Dashboard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dashboards);
    if (!raw) return [];
    return JSON.parse(raw) as Dashboard[];
  } catch {
    return [];
  }
};

export const saveDashboards = (dashboards: Dashboard[]) => {
  localStorage.setItem(STORAGE_KEYS.dashboards, JSON.stringify(dashboards));
};

export const loadEmpresas = (): Empresa[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.empresas);
    if (!raw) return [];
    return JSON.parse(raw) as Empresa[];
  } catch {
    return [];
  }
};

export const saveEmpresas = (empresas: Empresa[]) => {
  localStorage.setItem(STORAGE_KEYS.empresas, JSON.stringify(empresas));
};
