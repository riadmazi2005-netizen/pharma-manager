import { useCallback, useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoriesApi";

export const useCategories = (autoLoad = true) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : data?.results ?? []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) load();
  }, [autoLoad, load]);

  const add = async (payload) => {
    const created = await createCategory(payload);
    setCategories((p) => [...p, created]);
    return created;
  };

  const edit = async (id, payload) => {
    const updated = await updateCategory(id, payload);
    setCategories((p) => p.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const remove = async (id) => {
    await deleteCategory(id);
    setCategories((p) => p.filter((c) => c.id !== id));
  };

  return { categories, loading, error, reload: load, add, edit, remove };
};
