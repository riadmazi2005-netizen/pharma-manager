import { useCallback, useEffect, useState } from "react";
import {
  fetchMedicaments,
  createMedicament,
  updateMedicament,
  deleteMedicament,
  fetchAlertesStock,
} from "../api/medicamentsApi";

export const useMedicaments = (autoLoad = true) => {
  const [medicaments, setMedicaments] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const load = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedicaments(params);
      setMedicaments(Array.isArray(data) ? data : data?.results ?? []);
      if (data && data.count !== undefined) {
        setPagination({ count: data.count, next: data.next, previous: data.previous });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAlertes = useCallback(async () => {
    try {
      const data = await fetchAlertesStock();
      setAlertes(Array.isArray(data) ? data : data?.results ?? []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      load();
      loadAlertes();
    }
  }, [autoLoad, load, loadAlertes]);

  const add = async (payload) => {
    const created = await createMedicament(payload);
    setMedicaments((p) => [created, ...p]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateMedicament(id, payload);
    setMedicaments((p) => p.map((m) => (m.id === id ? updated : m)));
    return updated;
  };

  const remove = async (id) => {
    await deleteMedicament(id);
    setMedicaments((p) => p.filter((m) => m.id !== id));
  };

  return {
    medicaments,
    alertes,
    loading,
    error,
    pagination,
    reload: load,
    reloadAlertes: loadAlertes,
    add,
    edit,
    remove,
  };
};
