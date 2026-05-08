import { useEffect, useState } from "react";
import { Button } from "../common/Button";

const empty = {
  nom: "",
  dci: "",
  categorie: "",
  forme: "",
  dosage: "",
  prix_achat: "",
  prix_vente: "",
  stock_actuel: 0,
  stock_minimum: 0,
  date_expiration: "",
  ordonnance_requise: false,
};

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="font-medium text-slate-700 dark:text-gray-200">{label}</span>
    {children}
  </label>
);

const inputCls =
  "rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export const MedicamentForm = ({ initial, categories, onSubmit, onCancel }) => {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setForm(
      initial
        ? {
            ...empty,
            ...initial,
            categorie: initial.categorie?.id ?? initial.categorie ?? "",
            date_expiration: initial.date_expiration?.slice(0, 10) ?? "",
          }
        : empty
    );
  }, [initial]);

  const upd = (k) => (e) => {
    const v =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setForm((p) => ({ ...p, [k]: v }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        categorie: form.categorie || null,
        prix_achat: Number(form.prix_achat) || 0,
        prix_vente: Number(form.prix_vente) || 0,
        stock_actuel: Number(form.stock_actuel) || 0,
        stock_minimum: Number(form.stock_minimum) || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nom">
          <input className={inputCls} required value={form.nom} onChange={upd("nom")} />
        </Field>
        <Field label="DCI">
          <input className={inputCls} value={form.dci} onChange={upd("dci")} />
        </Field>
        <Field label="Catégorie">
          <select className={inputCls} value={form.categorie} onChange={upd("categorie")}>
            <option value="">— Sélectionner —</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Forme">
          <input className={inputCls} value={form.forme} onChange={upd("forme")} placeholder="Comprimé, sirop..." />
        </Field>
        <Field label="Dosage">
          <input className={inputCls} value={form.dosage} onChange={upd("dosage")} placeholder="500mg" />
        </Field>
        <Field label="Date d'expiration">
          <input type="date" className={inputCls} value={form.date_expiration} onChange={upd("date_expiration")} />
        </Field>
        <Field label="Prix d'achat (MAD)">
          <input type="number" step="0.01" className={inputCls} value={form.prix_achat} onChange={upd("prix_achat")} />
        </Field>
        <Field label="Prix de vente (MAD)">
          <input type="number" step="0.01" className={inputCls} value={form.prix_vente} onChange={upd("prix_vente")} />
        </Field>
        <Field label="Stock actuel">
          <input type="number" className={inputCls} value={form.stock_actuel} onChange={upd("stock_actuel")} />
        </Field>
        <Field label="Stock minimum">
          <input type="number" className={inputCls} value={form.stock_minimum} onChange={upd("stock_minimum")} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-200">
        <input type="checkbox" checked={form.ordonnance_requise} onChange={upd("ordonnance_requise")} />
        Ordonnance requise
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};
