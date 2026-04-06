import { useMemo, useState } from "react";
import { DataSource } from "../types/dashboard";
import { DataSourceForm } from "./DataSourceForm";
import { createId } from "../utils/id";
import { buildUrl } from "../utils/request";
import { clamp } from "../utils/format";

const makeDataSource = (): DataSource => ({
  id: createId(),
  nome: "Nova fonte",
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
});

type Props = {
  dataSources: DataSource[];
  setDataSources: (next: DataSource[]) => void;
};

export const DataSourcesPage = ({ dataSources, setDataSources }: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(dataSources[0]?.id ?? null);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const selected = useMemo(
    () => dataSources.find((ds) => ds.id === selectedId) || dataSources[0] || null,
    [dataSources, selectedId]
  );

  const upsert = (next: DataSource) => {
    const updated = dataSources.some((ds) => ds.id === next.id)
      ? dataSources.map((ds) => (ds.id === next.id ? next : ds))
      : [...dataSources, next];

    const normalized = next.isDefault
      ? updated.map((ds) => ({ ...ds, isDefault: ds.id === next.id }))
      : updated;
    setDataSources(normalized);
    setSelectedId(next.id);
  };

  const remove = (id: string) => {
    const filtered = dataSources.filter((ds) => ds.id !== id);
    setDataSources(filtered);
    setSelectedId(filtered[0]?.id ?? null);
  };

  const handleTest = async (ds: DataSource) => {
    if (!ds.url) {
      setTestStatus("Informe a URL para testar a conexão.");
      return;
    }
    try {
      setTestStatus("Testando conexão...");
      let url = buildUrl(ds.url, ds.queryString || "");
      const headers: Record<string, string> = {};
      ds.headers.forEach((h) => {
        if (h.key) headers[h.key] = h.value || "";
      });
      if (ds.auth.method === "bearer" && ds.auth.bearerToken) {
        headers["Authorization"] = `Bearer ${ds.auth.bearerToken}`;
      }
      if (ds.auth.method === "basic" && ds.auth.basicUser && ds.auth.basicPass) {
        const token = btoa(`${ds.auth.basicUser}:${ds.auth.basicPass}`);
        headers["Authorization"] = `Basic ${token}`;
      }
      if (ds.auth.method === "apikey" && ds.auth.apiKeyName && ds.auth.apiKeyValue) {
        if (ds.auth.apiKeyIn === "query") {
          const u = new URL(url, window.location.origin);
          if (!u.searchParams.has(ds.auth.apiKeyName)) {
            u.searchParams.append(ds.auth.apiKeyName, ds.auth.apiKeyValue);
          }
          url = u.toString();
        } else {
          headers[ds.auth.apiKeyName] = ds.auth.apiKeyValue;
        }
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), clamp(ds.timeoutSeconds, 2, 60) * 1000);
      const res = await fetch(url, { headers, credentials: "omit", signal: controller.signal });
      clearTimeout(timeout);
      setTestStatus(res.ok ? "Conexão OK." : "Falha ao consultar a API.");
    } catch {
      setTestStatus("Falha ao consultar a API.");
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-4 space-y-4">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400 uppercase tracking-widest">Data Sources</div>
            <button
              className="text-xs text-emerald-400"
              onClick={() => {
                const next = makeDataSource();
                setDataSources([...dataSources, next]);
                setSelectedId(next.id);
              }}
            >
              + Criar
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {dataSources.map((ds) => (
              <button
                key={ds.id}
                className={`w-full text-left rounded-xl border px-3 py-3 ${
                  ds.id === selectedId ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-800 bg-zinc-950/60"
                }`}
                onClick={() => setSelectedId(ds.id)}
              >
                <div className="text-sm text-white">{ds.nome}</div>
                <div className="text-xs text-zinc-500">{ds.tipo} · {ds.url ? ds.url.slice(0, 36) : "URL não configurada"}</div>
              </button>
            ))}
            {dataSources.length === 0 ? (
              <div className="text-xs text-zinc-500">Nenhuma fonte cadastrada.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-8">
        {selected ? (
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">Editor de Data Source</div>
                <div className="text-xs text-zinc-500">{selected.nome}</div>
              </div>
              {testStatus ? <div className="text-xs text-zinc-400">{testStatus}</div> : null}
            </div>
            <DataSourceForm
              dataSource={selected}
              setDataSource={upsert}
              onSave={() => upsert(selected)}
              onTest={() => handleTest(selected)}
              onDelete={() => remove(selected.id)}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 text-zinc-400">
            Selecione ou crie um Data Source para editar.
          </div>
        )}
      </div>
    </div>
  );
};
