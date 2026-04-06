import { PanelFieldMap } from "../types/dashboard";
import { createId } from "../utils/id";

const validate = (mapping: PanelFieldMap[]) => {
  const errors: Record<string, string> = {};
  const aliases = mapping
    .map((m) => m.alias.trim())
    .filter(Boolean)
    .reduce<Record<string, number>>((acc, alias) => {
      acc[alias] = (acc[alias] || 0) + 1;
      return acc;
    }, {});

  mapping.forEach((m) => {
    if (!m.jsonPath.trim()) {
      errors[m.id] = "JSONPath não pode ficar vazio.";
      return;
    }
    if (m.alias && aliases[m.alias.trim()] > 1) {
      errors[m.id] = "Alias duplicado.";
    }
  });

  return errors;
};

type Props = {
  mapping: PanelFieldMap[];
  setMapping: (next: PanelFieldMap[]) => void;
  rawPreview: unknown;
  mappedPreview: Record<string, unknown>[];
  onSave: () => void;
};

export const JsonMappingTable = ({ mapping, setMapping, rawPreview, mappedPreview, onSave }: Props) => {
  const errors = validate(mapping);
  const addRow = () =>
    setMapping([
      ...mapping,
      { id: createId(), nome: "", jsonPath: "", sourceType: "JSONPath", type: "auto", alias: "" },
    ]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-zinc-400">
        Configure os campos do painel. Cada painel pode ter o seu próprio mapeamento.
      </div>
      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800">
        <div className="grid grid-cols-6 text-xs text-zinc-500 uppercase tracking-widest px-4 py-3 border-b border-zinc-800">
          <div>Nome do campo</div>
          <div>JSONPath</div>
          <div>Origem</div>
          <div>Tipo</div>
          <div>Alias</div>
          <div>Ações</div>
        </div>
        <div className="p-4 space-y-3">
          {mapping.map((m) => (
            <div key={m.id} className="grid grid-cols-6 gap-2 items-center">
              <input
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-white"
                value={m.nome}
                onChange={(e) => setMapping(mapping.map((x) => (x.id === m.id ? { ...x, nome: e.target.value } : x)))}
              />
              <input
                className={`bg-zinc-950 border rounded-lg px-2 py-2 text-white ${
                  errors[m.id] ? "border-red-600" : "border-zinc-800"
                }`}
                value={m.jsonPath}
                onChange={(e) =>
                  setMapping(mapping.map((x) => (x.id === m.id ? { ...x, jsonPath: e.target.value } : x)))
                }
              />
              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-white"
                value={m.sourceType}
                onChange={(e) =>
                  setMapping(mapping.map((x) => (x.id === m.id ? { ...x, sourceType: e.target.value as "JSONPath" } : x)))
                }
              >
                <option value="JSONPath">JSONPath</option>
              </select>
              <select
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-white"
                value={m.type}
                onChange={(e) =>
                  setMapping(mapping.map((x) => (x.id === m.id ? { ...x, type: e.target.value as PanelFieldMap["type"] } : x)))
                }
              >
                <option value="auto">auto</option>
                <option value="string">texto</option>
                <option value="number">número</option>
                <option value="boolean">booleano</option>
                <option value="date">data</option>
              </select>
              <input
                className={`bg-zinc-950 border rounded-lg px-2 py-2 text-white ${
                  errors[m.id] ? "border-red-600" : "border-zinc-800"
                }`}
                value={m.alias}
                onChange={(e) => setMapping(mapping.map((x) => (x.id === m.id ? { ...x, alias: e.target.value } : x)))}
              />
              <button
                className="text-zinc-400 hover:text-white"
                onClick={() => setMapping(mapping.filter((x) => x.id !== m.id))}
              >
                Remover
              </button>
              {errors[m.id] ? <div className="col-span-6 text-xs text-red-600">{errors[m.id]}</div> : null}
            </div>
          ))}
          <button className="text-xs text-emerald-500" onClick={addRow}>
            + Adicionar campo
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-4">
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Pré-visualização dos dados extraídos</div>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 md:col-span-6">
            <div className="text-xs text-zinc-500">Resposta bruta</div>
            <pre className="mt-2 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 max-h-56 overflow-auto">
              {rawPreview ? JSON.stringify(rawPreview, null, 2) : "Sem dados"}
            </pre>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="text-xs text-zinc-500">Mapeamento</div>
            <pre className="mt-2 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 max-h-56 overflow-auto">
              {mappedPreview?.length ? JSON.stringify(mappedPreview.slice(0, 8), null, 2) : "Sem dados"}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold" onClick={onSave}>
          SALVAR MAPEAMENTO
        </button>
      </div>
    </div>
  );
};
