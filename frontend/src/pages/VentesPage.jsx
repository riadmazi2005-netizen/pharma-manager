import { useState } from "react";
import { Header } from "../components/common/Header";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { MedicamentSearch } from "../components/ventes/MedicamentSearch";
import { ShoppingCart } from "../components/ventes/ShoppingCart";
import { useMedicaments } from "../hooks/useMedicaments";
import { useVentes } from "../hooks/useVentes";

export const VentesPage = () => {
  const { medicaments, loading, error, reload: reloadMeds } = useMedicaments();
  const { create, error: errVente } = useVentes(false);
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const addToCart = (m, qty = 1) =>
    setCart((p) => {
      const found = p.find((it) => it.id === m.id);
      if (found)
        return p.map((it) =>
          it.id === m.id ? { ...it, quantite: it.quantite + qty } : it
        );
      return [...p, { id: m.id, nom: m.nom, prix_vente: m.prix_vente, quantite: qty }];
    });

  const inc = (id) =>
    setCart((p) => p.map((it) => (it.id === id ? { ...it, quantite: it.quantite + 1 } : it)));
  const dec = (id) =>
    setCart((p) =>
      p
        .map((it) => (it.id === id ? { ...it, quantite: it.quantite - 1 } : it))
        .filter((it) => it.quantite > 0)
    );
  const removeItem = (id) => setCart((p) => p.filter((it) => it.id !== id));
  const clear = () => setCart([]);

  const confirm = async () => {
    setSubmitting(true);
    setFeedback(null);
    try {
      await create({
        lignes: cart.map((it) => ({
          medicament: it.id,
          quantite: it.quantite,
          prix_unitaire: it.prix_vente,
        })),
      });
      setFeedback({ type: "ok", message: "Vente enregistrée avec succès" });
      clear();
      reloadMeds();
    } catch (e) {
      setFeedback({ type: "err", message: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <Header title="Ventes" subtitle="Encaisser une nouvelle vente" />
      <div className="space-y-4 p-8">
        {(error || errVente) && <ErrorState message={error || errVente} />}
        {feedback && (
          <div
            className={`rounded-md px-4 py-3 text-sm ${
              feedback.type === "ok"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {loading ? (
            <LoadingState />
          ) : (
            <MedicamentSearch medicaments={medicaments} onAdd={addToCart} />
          )}
          <ShoppingCart
            items={cart}
            onInc={inc}
            onDec={dec}
            onRemove={removeItem}
            onClear={clear}
            onConfirm={confirm}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default VentesPage;
