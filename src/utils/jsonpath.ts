export const evalJsonPath = (input: unknown, path: string): unknown[] => {
  if (!path || !path.startsWith("$")) return [];
  if (path === "$") return [input];
  const tokens = path
    .replace(/^\$\./, "")
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/\[\*\]/g, ".*")
    .split(".")
    .filter(Boolean);

  let nodes: unknown[] = [input];
  for (const t of tokens) {
    if (t === "*") {
      nodes = nodes.flatMap((n) =>
        Array.isArray(n) ? n : n && typeof n === "object" ? Object.values(n as Record<string, unknown>) : []
      );
    } else {
      nodes = nodes
        .map((n) => (n != null ? (n as Record<string, unknown>)[t] : undefined))
        .filter((v) => v !== undefined);
    }
  }
  return nodes;
};
