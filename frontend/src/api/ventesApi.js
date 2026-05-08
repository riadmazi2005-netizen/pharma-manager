import api from "./axiosConfig";

export const fetchVentes = async (params = {}) => {
  const { data } = await api.get("/ventes/", { params });
  return data;
};

export const fetchVente = async (id) => {
  const { data } = await api.get(`/ventes/${id}/`);
  return data;
};

export const createVente = async (payload) => {
  const { data } = await api.post("/ventes/", payload);
  return data;
};

export const annulerVente = async (id) => {
  const { data } = await api.post(`/ventes/${id}/annuler/`);
  return data;
};
