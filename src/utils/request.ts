export const buildUrl = (baseUrl: string, queryString: string) => {
  if (!queryString?.trim()) return baseUrl;
  try {
    const [basePath, baseQuery] = baseUrl.split("?");
    const existing = new URLSearchParams(baseQuery || "");
    const incoming = new URLSearchParams(queryString.replace(/^\?/, ""));
    incoming.forEach((value, key) => {
      if (!existing.has(key)) {
        existing.append(key, value);
      }
    });
    const finalQuery = existing.toString();
    return finalQuery ? `${basePath}?${finalQuery}` : basePath;
  } catch {
    if (baseUrl.includes("?")) {
      return `${baseUrl}&${queryString.replace(/^\?/, "")}`;
    }
    return `${baseUrl}?${queryString.replace(/^\?/, "")}`;
  }
};
