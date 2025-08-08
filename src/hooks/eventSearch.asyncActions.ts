import { useEffect, useState, useCallback } from "react";
import { http } from "../data/config";

export function useGetIndices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIndices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http.get(`/indices`);
      setData(res.data.indices || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  return { data, loading, error, refetch: fetchIndices };
}

// export type IndexSummary = {
//   index: string;
//   health: string;
//   status: string;
//   uuid: string;
//   primaryShards: number;
//   replicaShards: number;
//   docs: number;
//   storeSize: string;
// };

// type IndicesResponse = {
//   count: number;
//   indices: IndexSummary[];
// };

export function useGetPaginatedLogs(indexName?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await http.get("/logs", {
        params: { indexName: indexName },
      });
      setData(res.data.hits || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { data, loading, error, refetch: fetchLogs };
}
