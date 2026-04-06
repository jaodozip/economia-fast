import { Panel } from "../types/dashboard";
import { getAliasOptions } from "../utils/mapping";

type Props = {
  panel: Panel;
  setPanel: (next: Panel) => void;
};

export const KpiFieldConfig = ({ panel, setPanel }: Props) => {
  const aliases = getAliasOptions(panel.fieldMappings);
  const metas = panel.config.metas || {
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
  };

  const updateMetas = (patch: Partial<typeof metas>) =>
    setPanel({
      ...panel,
      config: { ...panel.config, metas: { ...metas, ...patch } },
    });

  const renderSelect = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="col-span-12 md:col-span-6">
      <label className="text-xs text-zinc-500">{label}</label>
      <select
        className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecionar</option>
        {aliases.map((alias) => (
          <option key={alias} value={alias}>
            {alias}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="text-xs text-zinc-500 uppercase tracking-widest">Regras do painel de metas</div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={metas.showColchoes}
              onChange={(e) => updateMetas({ showColchoes: e.target.checked })}
            />
            Mostrar Colchões
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={metas.showBox}
              onChange={(e) => updateMetas({ showBox: e.target.checked })}
            />
            Mostrar Box
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={metas.usarMetasManuais}
              onChange={(e) => updateMetas({ usarMetasManuais: e.target.checked })}
            />
            Definir metas manualmente
          </label>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {renderSelect("Colchões - Realizado", metas.colchaoRealizado, (v) => updateMetas({ colchaoRealizado: v }))}
        {metas.usarMetasManuais ? (
          <div className="col-span-12 md:col-span-6">
            <label className="text-xs text-zinc-500">Colchões - Meta (manual)</label>
            <input
              type="number"
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={metas.metaManualColchao}
              onChange={(e) => updateMetas({ metaManualColchao: Number(e.target.value) })}
            />
          </div>
        ) : (
          renderSelect("Colchões - Meta", metas.colchaoMeta, (v) => updateMetas({ colchaoMeta: v }))
        )}

        {renderSelect("Box - Realizado", metas.boxRealizado, (v) => updateMetas({ boxRealizado: v }))}
        {metas.usarMetasManuais ? (
          <div className="col-span-12 md:col-span-6">
            <label className="text-xs text-zinc-500">Box - Meta (manual)</label>
            <input
              type="number"
              className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
              value={metas.metaManualBox}
              onChange={(e) => updateMetas({ metaManualBox: Number(e.target.value) })}
            />
          </div>
        ) : (
          renderSelect("Box - Meta", metas.boxMeta, (v) => updateMetas({ boxMeta: v }))
        )}

        {renderSelect("Produtos em atraso", metas.produtosAtraso, (v) => updateMetas({ produtosAtraso: v }))}
      </div>
    </div>
  );
};
