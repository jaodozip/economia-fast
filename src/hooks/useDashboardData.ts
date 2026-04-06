import { useEffect, useMemo, useState } from "react";
import { DataSource, PanelFieldMap } from "../types/dashboard";
import { clamp } from "../utils/format";
import { extractMappedRows } from "../utils/mapping";
import { buildUrl } from "../utils/request";

export const useDashboardData = (
  dataSource: DataSource | null,
  mapping: PanelFieldMap[],
  pollingSeconds: number
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<unknown>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const configKey = useMemo(
    () =>
      JSON.stringify({
        url: dataSource?.url,
        queryString: dataSource?.queryString,
        timeoutSeconds: dataSource?.timeoutSeconds,
        headers: dataSource?.headers,
        auth: dataSource?.auth,
      }),
    [dataSource]
  );

  const fetchData = async () => {
    if (!dataSource?.url) {
      setPayload(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = buildUrl(dataSource.url, dataSource.queryString || "");
      const headers: Record<string, string> = {};
      dataSource.headers.forEach((h) => {
        if (h.key) headers[h.key] = h.value || "";
      });
      if (dataSource.auth.method === "bearer" && dataSource.auth.bearerToken) {
        headers["Authorization"] = `Bearer ${dataSource.auth.bearerToken}`;
      }
      if (dataSource.auth.method === "basic" && dataSource.auth.basicUser && dataSource.auth.basicPass) {
        const token = btoa(`${dataSource.auth.basicUser}:${dataSource.auth.basicPass}`);
        headers["Authorization"] = `Basic ${token}`;
      }
      if (dataSource.auth.method === "apikey" && dataSource.auth.apiKeyName && dataSource.auth.apiKeyValue) {
        if (dataSource.auth.apiKeyIn === "query") {
          const u = new URL(url, window.location.origin);
          if (!u.searchParams.has(dataSource.auth.apiKeyName)) {
            u.searchParams.append(dataSource.auth.apiKeyName, dataSource.auth.apiKeyValue);
          }
          url = u.toString();
        } else {
          headers[dataSource.auth.apiKeyName] = dataSource.auth.apiKeyValue;
        }
      }
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        clamp(dataSource.timeoutSeconds, 2, 60) * 1000
      );
      const res = await fetch(url, {
        headers,
        credentials: "omit",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("HTTP");
      const data = await res.json();
      setPayload(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (e) {
      setError("Falha ao consultar a API.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, clamp(pollingSeconds, 5, 60) * 1000);
    return () => clearInterval(id);
  }, [configKey, pollingSeconds]);

  const mappedRows = useMemo(() => extractMappedRows(payload, mapping), [payload, mapping]);

  return { loading, error, payload, mappedRows, lastUpdated, refetch: fetchData };
};
