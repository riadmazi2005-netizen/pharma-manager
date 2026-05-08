export const formatCurrency = (value) => {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
  }).format(n);
};

export const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("fr-FR");
  } catch {
    return value;
  }
};

export const formatDateTime = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};
