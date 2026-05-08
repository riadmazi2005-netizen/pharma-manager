import api from "./axiosConfig";

export const fetchMedicaments = async (params = {}) => {
  const { data } = await api.get("/medicaments/", { params });
  return data;
};

export const fetchMedicament = async (id) => {
  const { data } = await api.get(`/medicaments/${id}/`);
  return data;
};

export const createMedicament = async (payload) => {
  const { data } = await api.post("/medicaments/", payload);
  return data;
};

export const updateMedicament = async (id, payload) => {
  const { data } = await api.put(`/medicaments/${id}/`, payload);
  return data;
};

export const deleteMedicament = async (id) => {
  await api.delete(`/medicaments/${id}/`);
  return id;
};

export const fetchAlertesStock = async () => {
  const { data } = await api.get("/medicaments/alertes/");
  return data;
};
