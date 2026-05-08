import { useCallback, useEffect, useState } from "react";
import {
  fetchVentes,
  createVente,
  annulerVente,
} from "../api/ventesApi";

export const useVentes = (autoLoad = true, params = {}) => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (overrideParams) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVentes(overrideParams ?? params);
        setVentes(Array.isArray(data) ? data : data?.results ?? []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  const create = async (payload) => {
    const created = await createVente(payload);
    setVentes((p) => [created, ...p]);
    return created;
  };

  const cancel = async (id) => {
    const updated = await annulerVente(id);
    setVentes((p) => p.map((v) => (v.id === id ? { ...v, ...updated } : v)));
    return updated;
  };

  return { ventes, loading, error, reload: load, create, cancel };
};
