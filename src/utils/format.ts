export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export const percentOf = (current: number, goal: number) => (goal > 0 ? Math.round((current / goal) * 100) : 0);

export const formatNumber = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));
