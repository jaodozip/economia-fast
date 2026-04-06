import { ChangeEvent, useMemo, useRef, useState } from "react";

type Transaction = {
  id: string;
  type: "Entrada" | "Saída";
  category: string;
  amount: number;
  date: string;
};

type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
};

type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
};

const STORAGE_KEY = "economiafast:v2";

const defaultTransactions: Transaction[] = [
  { id: "t1", type: "Saída", category: "Alimentação", amount: 82.5, date: "2026-04-01" },
  { id: "t2", type: "Entrada", category: "Salário", amount: 4200, date: "2026-04-01" },
  { id: "t3", type: "Saída", category: "Transporte", amount: 45.2, date: "2026-04-02" },
  { id: "t4", type: "Saída", category: "Moradia", amount: 1200, date: "2026-04-02" },
  { id: "t5", type: "Saída", category: "Lazer", amount: 160, date: "2026-04-03" },
  { id: "t6", type: "Entrada", category: "Freelance", amount: 620, date: "2026-04-03" },
];

const defaultGoals: Goal[] = [
  { id: "g1", name: "Reserva de emergência", target: 6000, saved: 4320 },
  { id: "g2", name: "Viagem", target: 2500, saved: 950 },
  { id: "g3", name: "Curso", target: 1800, saved: 720 },
];

const defaultBills: Bill[] = [
  { id: "b1", name: "Internet", amount: 120, dueDate: "2026-04-08", paid: false },
  { id: "b2", name: "Energia", amount: 210.45, dueDate: "2026-04-12", paid: false },
  { id: "b3", name: "Cartão de crédito", amount: 980.3, dueDate: "2026-04-15", paid: false },
];

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        transactions: defaultTransactions,
        goals: defaultGoals,
        bills: defaultBills,
        balanceBase: 1500,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      transactions: parsed.transactions || defaultTransactions,
      goals: parsed.goals || defaultGoals,
      bills: parsed.bills || defaultBills,
      balanceBase: typeof parsed.balanceBase === "number" ? parsed.balanceBase : 1500,
    };
  } catch {
    return {
      transactions: defaultTransactions,
      goals: defaultGoals,
      bills: defaultBills,
      balanceBase: 1500,
    };
  }
};

const saveState = (state: {
  transactions: Transaction[];
  goals: Goal[];
  bills: Bill[];
  balanceBase: number;
}) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const App = () => {
  const initial = loadState();
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [goals, setGoals] = useState<Goal[]>(initial.goals);
  const [bills, setBills] = useState<Bill[]>(initial.bills);
  const [balanceBase, setBalanceBase] = useState<number>(initial.balanceBase);

  const [form, setForm] = useState({ type: "Saída", category: "", amount: "", date: "" });
  const [goalForm, setGoalForm] = useState({ name: "", target: "", saved: "" });
  const [billForm, setBillForm] = useState({ name: "", amount: "", dueDate: "" });

  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState({ type: "Saída", category: "", amount: "", date: "" });

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState({ name: "", target: "", saved: "" });

  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [editingBill, setEditingBill] = useState({ name: "", amount: "", dueDate: "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const paidBillsTotal = useMemo(
    () => bills.filter((b) => b.paid).reduce((acc, b) => acc + b.amount, 0),
    [bills]
  );

  const summary = useMemo(() => {
    const totalIn = transactions.filter((t) => t.type === "Entrada").reduce((acc, t) => acc + t.amount, 0);
    const totalOut = transactions.filter((t) => t.type === "Saída").reduce((acc, t) => acc + t.amount, 0);
    const balance = balanceBase + totalIn - totalOut - paidBillsTotal;
    return {
      totalIn,
      totalOut,
      balance,
      savingsRate: totalIn ? Math.round((balance / totalIn) * 100) : 0,
    };
  }, [transactions, balanceBase, paidBillsTotal]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "Saída")
      .forEach((t) => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const cashflow = [
    { month: "Nov", value: 18 },
    { month: "Dez", value: 22 },
    { month: "Jan", value: 26 },
    { month: "Fev", value: 19 },
    { month: "Mar", value: 28 },
    { month: "Abr", value: 24 },
  ];

  const trendPoints = [12, 18, 15, 22, 28, 24, 30];

  const persist = (next: {
    transactions?: Transaction[];
    goals?: Goal[];
    bills?: Bill[];
    balanceBase?: number;
  }) => {
    saveState({
      transactions: next.transactions ?? transactions,
      goals: next.goals ?? goals,
      bills: next.bills ?? bills,
      balanceBase: typeof next.balanceBase === "number" ? next.balanceBase : balanceBase,
    });
  };

  const handleExportData = () => {
    const payload = {
      transactions,
      goals,
      bills,
      balanceBase,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "economiafast-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const nextTransactions = Array.isArray(parsed.transactions) ? parsed.transactions : transactions;
        const nextGoals = Array.isArray(parsed.goals) ? parsed.goals : goals;
        const nextBills = Array.isArray(parsed.bills) ? parsed.bills : bills;
        const nextBalance = typeof parsed.balanceBase === "number" ? parsed.balanceBase : balanceBase;
        setTransactions(nextTransactions);
        setGoals(nextGoals);
        setBills(nextBills);
        setBalanceBase(nextBalance);
        persist({
          transactions: nextTransactions,
          goals: nextGoals,
          bills: nextBills,
          balanceBase: nextBalance,
        });
      } catch {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleAddTransaction = () => {
    const amount = Number(form.amount);
    if (!form.category || !form.date || Number.isNaN(amount)) return;
    const next = [
      { id: `t${Date.now()}`, type: form.type as Transaction["type"], category: form.category, amount, date: form.date },
      ...transactions,
    ];
    setTransactions(next);
    persist({ transactions: next });
    setForm({ type: "Saída", category: "", amount: "", date: "" });
  };

  const handleDeleteTransaction = (id: string) => {
    const next = transactions.filter((t) => t.id !== id);
    setTransactions(next);
    persist({ transactions: next });
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setEditingTx({
      type: tx.type,
      category: tx.category,
      amount: String(tx.amount),
      date: tx.date,
    });
  };

  const handleSaveTransaction = () => {
    if (!editingTxId) return;
    const amount = Number(editingTx.amount);
    if (!editingTx.category || !editingTx.date || Number.isNaN(amount)) return;
    const next = transactions.map((t) =>
      t.id === editingTxId
        ? {
            ...t,
            type: editingTx.type as Transaction["type"],
            category: editingTx.category,
            amount,
            date: editingTx.date,
          }
        : t
    );
    setTransactions(next);
    persist({ transactions: next });
    setEditingTxId(null);
  };

  const handleAddGoal = () => {
    const target = Number(goalForm.target);
    const saved = Number(goalForm.saved);
    if (!goalForm.name || Number.isNaN(target) || Number.isNaN(saved)) return;
    const next = [{ id: `g${Date.now()}`, name: goalForm.name, target, saved }, ...goals];
    setGoals(next);
    persist({ goals: next });
    setGoalForm({ name: "", target: "", saved: "" });
  };

  const handleDeleteGoal = (id: string) => {
    const next = goals.filter((g) => g.id !== id);
    setGoals(next);
    persist({ goals: next });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingGoal({ name: goal.name, target: String(goal.target), saved: String(goal.saved) });
  };

  const handleSaveGoal = () => {
    if (!editingGoalId) return;
    const target = Number(editingGoal.target);
    const saved = Number(editingGoal.saved);
    if (!editingGoal.name || Number.isNaN(target) || Number.isNaN(saved)) return;
    const next = goals.map((g) =>
      g.id === editingGoalId ? { ...g, name: editingGoal.name, target, saved } : g
    );
    setGoals(next);
    persist({ goals: next });
    setEditingGoalId(null);
  };

  const handleAddBill = () => {
    const amount = Number(billForm.amount);
    if (!billForm.name || !billForm.dueDate || Number.isNaN(amount)) return;
    const next = [
      { id: `b${Date.now()}`, name: billForm.name, amount, dueDate: billForm.dueDate, paid: false },
      ...bills,
    ];
    setBills(next);
    persist({ bills: next });
    setBillForm({ name: "", amount: "", dueDate: "" });
  };

  const handleToggleBill = (id: string) => {
    const next = bills.map((b) => (b.id === id ? { ...b, paid: !b.paid } : b));
    setBills(next);
    persist({ bills: next });
  };

  const handleDeleteBill = (id: string) => {
    const next = bills.filter((b) => b.id !== id);
    setBills(next);
    persist({ bills: next });
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBillId(bill.id);
    setEditingBill({ name: bill.name, amount: String(bill.amount), dueDate: bill.dueDate });
  };

  const handleSaveBill = () => {
    if (!editingBillId) return;
    const amount = Number(editingBill.amount);
    if (!editingBill.name || !editingBill.dueDate || Number.isNaN(amount)) return;
    const next = bills.map((b) =>
      b.id === editingBillId ? { ...b, name: editingBill.name, amount, dueDate: editingBill.dueDate } : b
    );
    setBills(next);
    persist({ bills: next });
    setEditingBillId(null);
  };

  const handleBalanceBaseChange = (value: string) => {
    const next = Number(value);
    if (Number.isNaN(next)) return;
    setBalanceBase(next);
    persist({ balanceBase: next });
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="absolute inset-0 hero-glow" />
      <div className="relative">
        <header className="main-header">
          <div className="brand">
            <div className="logo-mark">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="14" width="36" height="20" rx="10" fill="#A7F3D0" stroke="#0F172A" strokeWidth="2" />
                <rect x="19" y="21" width="10" height="6" rx="3" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
                <circle cx="22" cy="24" r="1" fill="#0F172A" />
                <circle cx="26" cy="24" r="1" fill="#0F172A" />
                <path d="M16 16L12.5 12" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M32 16L35.5 12" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M36 28C38 28 40 26.5 40 24.5" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M25.2 12L23 15.5H26.4L24.6 19" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="wordmark">
              <span className="text-2xl font-semibold text-ink">economia</span>
              <span className="text-2xl font-bold text-green">fast</span>
            </div>
          </div>
          <div className="header-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="file-input"
              onChange={handleImportData}
            />
            <div className="header-date">Atualizado em 06 de abril de 2026</div>
            <button className="secondary-button" onClick={handleExportData}>Exportar dados</button>
            <button className="secondary-button" onClick={() => fileInputRef.current?.click()}>Importar dados</button>
            <button className="primary-button">Novo lançamento</button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-16">
          <section className="summary-grid">
            <div className="stat-card">
              <div className="text-sm text-ink-soft">Entradas do mês</div>
              <div className="text-2xl font-semibold">R$ {summary.totalIn.toFixed(2)}</div>
              <div className="tag tag-green">Receitas em dia</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-ink-soft">Saídas do mês</div>
              <div className="text-2xl font-semibold">R$ {summary.totalOut.toFixed(2)}</div>
              <div className="tag tag-amber">Atenção às variáveis</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-ink-soft">Saldo atual</div>
              <div className="text-2xl font-semibold">R$ {summary.balance.toFixed(2)}</div>
              <div className="tag tag-green">{summary.savingsRate}% de economia</div>
            </div>
            <div className="stat-card">
              <div className="text-sm text-ink-soft">Metas ativas</div>
              <div className="text-2xl font-semibold">{goals.length}</div>
              <div className="tag tag-green">Progresso contínuo</div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="column">
              <div className="panel-card">
                <div className="panel-title">Movimentações recentes</div>
                <div className="table">
                  <div className="table-row table-head">
                    <span>Tipo</span>
                    <span>Categoria</span>
                    <span>Data</span>
                    <span className="text-right">Valor</span>
                    <span className="text-right">Ações</span>
                  </div>
                  {transactions.map((t) => (
                    <div key={t.id} className="table-row">
                      <span>{editingTxId === t.id ? (
                        <select value={editingTx.type} onChange={(e) => setEditingTx({ ...editingTx, type: e.target.value })}>
                          <option>Entrada</option>
                          <option>Saída</option>
                        </select>
                      ) : t.type}</span>
                      <span>{editingTxId === t.id ? (
                        <input value={editingTx.category} onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })} />
                      ) : t.category}</span>
                      <span>{editingTxId === t.id ? (
                        <input type="date" value={editingTx.date} onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })} />
                      ) : t.date}</span>
                      <span className="text-right">{editingTxId === t.id ? (
                        <input type="number" value={editingTx.amount} onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })} />
                      ) : `R$ ${t.amount.toFixed(2)}`}</span>
                      <span className="text-right actions">
                        {editingTxId === t.id ? (
                          <>
                            <button className="link-button" onClick={handleSaveTransaction}>Salvar</button>
                            <button className="link-button muted" onClick={() => setEditingTxId(null)}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="link-button" onClick={() => handleEditTransaction(t)}>Editar</button>
                            <button className="link-button danger" onClick={() => handleDeleteTransaction(t.id)}>Excluir</button>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-title">Categorias com maior gasto</div>
                <div className="category-list">
                  {categories.slice(0, 5).map((cat) => (
                    <div key={cat.label} className="category-item">
                      <div>
                        <div className="text-sm text-ink-soft">{cat.label}</div>
                        <div className="text-base font-semibold">R$ {cat.value.toFixed(2)}</div>
                      </div>
                      <div className="category-bar">
                        <div
                          className="category-fill"
                          style={{ width: `${Math.min(100, (cat.value / (categories[0]?.value || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-title">Checklist de contas</div>
                <div className="bill-list">
                  {bills.map((bill) => (
                    <div key={bill.id} className={bill.paid ? "bill-item paid" : "bill-item"}>
                      <label className="bill-check">
                        <input type="checkbox" checked={bill.paid} onChange={() => handleToggleBill(bill.id)} />
                        <span>
                          {editingBillId === bill.id ? (
                            <input value={editingBill.name} onChange={(e) => setEditingBill({ ...editingBill, name: e.target.value })} />
                          ) : bill.name}
                        </span>
                      </label>
                      <div className="bill-meta">
                        {editingBillId === bill.id ? (
                          <>
                            <input type="number" value={editingBill.amount} onChange={(e) => setEditingBill({ ...editingBill, amount: e.target.value })} />
                            <input type="date" value={editingBill.dueDate} onChange={(e) => setEditingBill({ ...editingBill, dueDate: e.target.value })} />
                          </>
                        ) : (
                          <>
                            <span>R$ {bill.amount.toFixed(2)}</span>
                            <span>Vence em {bill.dueDate}</span>
                          </>
                        )}
                      </div>
                      <div className="actions">
                        {editingBillId === bill.id ? (
                          <>
                            <button className="link-button" onClick={handleSaveBill}>Salvar</button>
                            <button className="link-button muted" onClick={() => setEditingBillId(null)}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="link-button" onClick={() => handleEditBill(bill)}>Editar</button>
                            <button className="link-button danger" onClick={() => handleDeleteBill(bill.id)}>Excluir</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-grid mt-4">
                  <label className="form-field">
                    Conta
                    <input value={billForm.name} onChange={(e) => setBillForm({ ...billForm, name: e.target.value })} placeholder="Ex: Internet" />
                  </label>
                  <label className="form-field">
                    Valor
                    <input type="number" value={billForm.amount} onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })} placeholder="R$ 0,00" />
                  </label>
                  <label className="form-field">
                    Vencimento
                    <input type="date" value={billForm.dueDate} onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })} />
                  </label>
                </div>
                <button className="secondary-button" onClick={handleAddBill}>Adicionar conta</button>
              </div>
            </div>

            <div className="column">
              <div className="panel-card">
                <div className="panel-title">Saldo base do mês</div>
                <div className="balance-row">
                  <label className="form-field">
                    Saldo atual inicial
                    <input
                      type="number"
                      value={balanceBase}
                      onChange={(e) => handleBalanceBaseChange(e.target.value)}
                      placeholder="R$ 0,00"
                    />
                  </label>
                  <div className="balance-hint">
                    Marque as contas como pagas para abatê-las do saldo automaticamente.
                  </div>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-title">Adicionar movimentação</div>
                <div className="form-grid">
                  <label className="form-field">
                    Tipo
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option>Entrada</option>
                      <option>Saída</option>
                    </select>
                  </label>
                  <label className="form-field">
                    Categoria
                    <input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Ex: Alimentação"
                    />
                  </label>
                  <label className="form-field">
                    Valor
                    <input
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder="R$ 0,00"
                      type="number"
                    />
                  </label>
                  <label className="form-field">
                    Data
                    <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" />
                  </label>
                </div>
                <button className="primary-button" onClick={handleAddTransaction}>Adicionar</button>
              </div>

              <div className="panel-card">
                <div className="panel-title">Metas financeiras</div>
                <div className="goal-list">
                  {goals.map((goal) => (
                    <div key={goal.id} className="goal-item">
                      {editingGoalId === goal.id ? (
                        <>
                          <input value={editingGoal.name} onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })} />
                          <input type="number" value={editingGoal.saved} onChange={(e) => setEditingGoal({ ...editingGoal, saved: e.target.value })} />
                          <input type="number" value={editingGoal.target} onChange={(e) => setEditingGoal({ ...editingGoal, target: e.target.value })} />
                          <div className="actions">
                            <button className="link-button" onClick={handleSaveGoal}>Salvar</button>
                            <button className="link-button muted" onClick={() => setEditingGoalId(null)}>Cancelar</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <div className="text-sm text-ink-soft">{goal.name}</div>
                            <div className="text-base font-semibold">R$ {goal.saved.toFixed(2)} / R$ {goal.target.toFixed(2)}</div>
                          </div>
                          <div className="goal-meter">
                            <div className="goal-fill" style={{ width: `${(goal.saved / goal.target) * 100}%` }} />
                          </div>
                          <div className="actions">
                            <button className="link-button" onClick={() => handleEditGoal(goal)}>Editar</button>
                            <button className="link-button danger" onClick={() => handleDeleteGoal(goal.id)}>Excluir</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="form-grid mt-4">
                  <label className="form-field">
                    Meta
                    <input
                      value={goalForm.name}
                      onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                      placeholder="Ex: Reserva"
                    />
                  </label>
                  <label className="form-field">
                    Valor alvo
                    <input
                      value={goalForm.target}
                      onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                      type="number"
                      placeholder="R$ 0,00"
                    />
                  </label>
                  <label className="form-field">
                    Já guardado
                    <input
                      value={goalForm.saved}
                      onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })}
                      type="number"
                      placeholder="R$ 0,00"
                    />
                  </label>
                </div>
                <button className="secondary-button" onClick={handleAddGoal}>Adicionar meta</button>
              </div>
            </div>
          </section>

          <section className="charts-grid">
            <div className="panel-card">
              <div className="panel-title">Fluxo de caixa (últimos 6 meses)</div>
              <div className="bar-chart">
                {cashflow.map((item) => (
                  <div key={item.month} className="bar-item">
                    <div className="bar" style={{ height: `${item.value * 3}px` }} />
                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel-card">
              <div className="panel-title">Distribuição de gastos</div>
              <div className="donut-row">
                <div
                  className="donut"
                  style={{
                    background: `conic-gradient(#22C55E 0 45%, #A7F3D0 45% 68%, #0F172A 68% 82%, #E2E8F0 82% 100%)`,
                  }}
                />
                <div className="donut-legend">
                  <div><span className="legend-dot dot-green" />Moradia</div>
                  <div><span className="legend-dot dot-mint" />Alimentação</div>
                  <div><span className="legend-dot dot-ink" />Transporte</div>
                  <div><span className="legend-dot dot-gray" />Outros</div>
                </div>
              </div>
            </div>
            <div className="panel-card">
              <div className="panel-title">Tendência de saldo</div>
              <svg className="trend" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline
                  points={trendPoints.map((v, i) => `${i * 36},${90 - v * 2}`).join(" ")}
                  stroke="#22C55E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <div className="trend-label">Saldo crescendo nas últimas semanas</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
