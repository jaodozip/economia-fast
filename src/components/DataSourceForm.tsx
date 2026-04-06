import { DataSource } from "../types/dashboard";
import { clamp } from "../utils/format";
import { createId } from "../utils/id";

type Props = {
  dataSource: DataSource;
  setDataSource: (next: DataSource) => void;
  onTest: () => void;
  onSave: () => void;
  onDelete?: () => void;
};

export const DataSourceForm = ({ dataSource, setDataSource, onTest, onSave, onDelete }: Props) => {
  const update = (patch: Partial<DataSource>) => setDataSource({ ...dataSource, ...patch });

  const addHeader = () => update({ headers: [...dataSource.headers, { id: createId(), key: "", value: "" }] });
  const addCookie = () => update({ cookies: [...dataSource.cookies, { id: createId(), value: "" }] });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <label className="text-xs text-zinc-500">Nome</label>
          <input
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dataSource.nome}
            onChange={(e) => update({ nome: e.target.value })}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
          <label className="text-xs text-zinc-500">Tipo</label>
          <select
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dataSource.tipo}
            onChange={(e) => update({ tipo: e.target.value as DataSource["tipo"] })}
          >
            <option value="REST">REST</option>
            <option value="GraphQL">GraphQL</option>
            <option value="Custom">Personalizado</option>
          </select>
        </div>
        <div className="col-span-12 md:col-span-4 flex items-end">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={dataSource.isDefault}
              onChange={(e) => update({ isDefault: e.target.checked })}
            />
            Data Source padrão
          </label>
        </div>
        <div className="col-span-12">
          <label className="text-xs text-zinc-500">URL</label>
          <input
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dataSource.url}
            onChange={(e) => update({ url: e.target.value })}
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="text-xs text-zinc-500">Parâmetros de consulta</label>
          <input
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dataSource.queryString}
            onChange={(e) => update({ queryString: e.target.value })}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <label className="text-xs text-zinc-500">Timeout em segundos</label>
          <input
            type="number"
            min={2}
            max={60}
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dataSource.timeoutSeconds}
            onChange={(e) => update({ timeoutSeconds: clamp(Number(e.target.value), 2, 60) })}
          />
        </div>
      </div>

      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Método de autenticação</div>
        <div className="mt-3 grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <select
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={dataSource.auth.method}
              onChange={(e) =>
                update({ auth: { ...dataSource.auth, method: e.target.value as DataSource["auth"]["method"] } })
              }
            >
              <option value="none">Sem autenticação</option>
              <option value="bearer">Token de acesso</option>
              <option value="basic">Autenticação básica</option>
              <option value="apikey">Chave de API</option>
            </select>
          </div>
          {dataSource.auth.method === "bearer" ? (
            <div className="col-span-12 md:col-span-8">
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                placeholder="Token de acesso"
                value={dataSource.auth.bearerToken ?? ""}
                onChange={(e) => update({ auth: { ...dataSource.auth, bearerToken: e.target.value } })}
              />
            </div>
          ) : null}
          {dataSource.auth.method === "basic" ? (
            <>
              <div className="col-span-12 md:col-span-4">
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  placeholder="Usuário"
                  value={dataSource.auth.basicUser ?? ""}
                  onChange={(e) => update({ auth: { ...dataSource.auth, basicUser: e.target.value } })}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <input
                  type="password"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  placeholder="Senha"
                  value={dataSource.auth.basicPass ?? ""}
                  onChange={(e) => update({ auth: { ...dataSource.auth, basicPass: e.target.value } })}
                />
              </div>
            </>
          ) : null}
          {dataSource.auth.method === "apikey" ? (
            <>
              <div className="col-span-12 md:col-span-4">
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  placeholder="Nome da chave"
                  value={dataSource.auth.apiKeyName ?? ""}
                  onChange={(e) => update({ auth: { ...dataSource.auth, apiKeyName: e.target.value } })}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <input
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  placeholder="Valor"
                  value={dataSource.auth.apiKeyValue ?? ""}
                  onChange={(e) => update({ auth: { ...dataSource.auth, apiKeyValue: e.target.value } })}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                <select
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  value={dataSource.auth.apiKeyIn ?? "header"}
                  onChange={(e) => update({ auth: { ...dataSource.auth, apiKeyIn: e.target.value as "header" | "query" } })}
                >
                  <option value="header">Cabeçalho</option>
                  <option value="query">Parâmetro</option>
                </select>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <div className="text-xs text-zinc-500">Configurações TLS</div>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={dataSource.tlsSelfSigned}
                onChange={(e) => update({ tlsSelfSigned: e.target.checked })}
              />
              Adicionar certificado autoassinado
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={dataSource.tlsClientAuth}
                onChange={(e) => update({ tlsClientAuth: e.target.checked })}
              />
              Autenticação de cliente TLS
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={dataSource.tlsSkipVerify}
                onChange={(e) => update({ tlsSkipVerify: e.target.checked })}
              />
              Ignorar validação do certificado TLS
            </label>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="text-xs text-zinc-500">Cookies permitidos</div>
          <div className="mt-2 space-y-2">
            {dataSource.cookies.map((c) => (
              <div key={c.id} className="flex gap-2">
                <input
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  value={c.value}
                  onChange={(e) =>
                    update({
                      cookies: dataSource.cookies.map((x) => (x.id === c.id ? { ...x, value: e.target.value } : x)),
                    })
                  }
                />
                <button
                  className="px-2 text-zinc-400 hover:text-white"
                  onClick={() => update({ cookies: dataSource.cookies.filter((x) => x.id !== c.id) })}
                >
                  Remover
                </button>
              </div>
            ))}
            <button className="text-xs text-emerald-500" onClick={addCookie}>
              + Adicionar cookie
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-zinc-500">Cabeçalhos HTTP</div>
        <div className="mt-2 space-y-2">
          {dataSource.headers.map((h) => (
            <div key={h.id} className="grid grid-cols-12 gap-2">
              <input
                className="col-span-5 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                placeholder="Cabeçalho"
                value={h.key}
                onChange={(e) =>
                  update({ headers: dataSource.headers.map((x) => (x.id === h.id ? { ...x, key: e.target.value } : x)) })
                }
              />
              <input
                className="col-span-6 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                placeholder="Valor"
                value={h.value}
                onChange={(e) =>
                  update({
                    headers: dataSource.headers.map((x) => (x.id === h.id ? { ...x, value: e.target.value } : x)),
                  })
                }
              />
              <button
                className="col-span-1 text-zinc-400 hover:text-white"
                onClick={() => update({ headers: dataSource.headers.filter((x) => x.id !== h.id) })}
              >
                X
              </button>
            </div>
          ))}
          <button className="text-xs text-emerald-500" onClick={addHeader}>
            + Adicionar cabeçalho
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {onDelete ? (
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={onDelete}>
            EXCLUIR DATA SOURCE
          </button>
        ) : null}
        <button
          className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          onClick={onTest}
        >
          TESTAR CONEXÃO
        </button>
        <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold" onClick={onSave}>
          SALVAR DATA SOURCE
        </button>
      </div>
    </div>
  );
};
