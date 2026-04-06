import { Empresa } from "../types/dashboard";
import { createId } from "../utils/id";

const makeEmpresa = (): Empresa => ({
  id: createId(),
  nome: "Nova empresa",
});

type Props = {
  empresas: Empresa[];
  setEmpresas: (next: Empresa[]) => void;
};

export const EmpresasPage = ({ empresas, setEmpresas }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-6">
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400 uppercase tracking-widest">Empresas</div>
            <button
              className="text-xs text-emerald-400"
              onClick={() => setEmpresas([...empresas, makeEmpresa()])}
            >
              + Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {empresas.map((empresa) => (
              <div key={empresa.id} className="rounded-xl bg-zinc-950/60 border border-zinc-800 p-3">
                <label className="text-xs text-zinc-500">Nome da empresa</label>
                <input
                  className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
                  value={empresa.nome}
                  onChange={(e) =>
                    setEmpresas(
                      empresas.map((item) => (item.id === empresa.id ? { ...item, nome: e.target.value } : item))
                    )
                  }
                />
              </div>
            ))}
            {empresas.length === 0 ? <div className="text-xs text-zinc-500">Nenhuma empresa.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};
