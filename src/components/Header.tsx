import { Dashboard, Empresa, TipoDashboard } from "../types/dashboard";

type Props = {
  empresa: Empresa;
  empresas: Empresa[];
  dashboards: Dashboard[];
  dashboardId: string;
  empresaId: string;
  tipo: TipoDashboard;
  onEmpresaChange: (id: string) => void;
  onDashboardChange: (id: string) => void;
  onTipoChange: (tipo: TipoDashboard) => void;
  logoUrl: string;
  lastUpdated: Date | null;
  now: Date;
  onOpenSettings?: () => void;
};

export const Header = ({
  empresa,
  empresas,
  dashboards,
  dashboardId,
  empresaId,
  tipo,
  onEmpresaChange,
  onDashboardChange,
  onTipoChange,
  logoUrl,
  lastUpdated,
  now,
  onOpenSettings,
}: Props) => {
  return (
    <header className="relative z-10 px-6 py-5 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
            MARCA
          </div>
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 object-contain" />
            ) : (
              <div className="text-lg font-semibold tracking-wide">{empresa.nome}</div>
            )}
            <div className="h-1 w-28 bg-red-600 mt-1" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-3">
            <div className="text-xs text-zinc-500 uppercase tracking-widest">ÚLTIMA ATUALIZAÇÃO</div>
            <div className="text-sm text-zinc-300">
              {lastUpdated ? lastUpdated.toLocaleTimeString("pt-BR") : "—"}
            </div>
          </div>
          <div className="text-sm text-zinc-300 font-semibold">{now.toLocaleTimeString("pt-BR")}</div>
          {onOpenSettings ? (
            <button
              className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-semibold"
              onClick={onOpenSettings}
            >
              CONFIGURAÇÕES
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-4">
          <label className="text-xs text-zinc-500">EMPRESA</label>
          <select
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={empresaId}
            onChange={(e) => onEmpresaChange(e.target.value)}
          >
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-12 md:col-span-4">
          <label className="text-xs text-zinc-500">DASHBOARD</label>
          <select
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={dashboardId}
            onChange={(e) => onDashboardChange(e.target.value)}
          >
            {dashboards.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-12 md:col-span-4">
          <label className="text-xs text-zinc-500">TIPO DO DASHBOARD</label>
          <select
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white"
            value={tipo}
            onChange={(e) => onTipoChange(e.target.value as TipoDashboard)}
          >
            {[
              { value: "metas", label: "METAS" },
              { value: "ranking", label: "RANKING" },
              { value: "cargas", label: "CARGAS" },
              { value: "misto", label: "MISTO" },
            ].map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
