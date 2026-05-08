import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/format";

export const ShoppingCart = ({
  items,
  onInc,
  onDec,
  onRemove,
  onClear,
  onConfirm,
  submitting,
}) => {
  const total = items.reduce(
    (acc, it) => acc + Number(it.prix_vente) * it.quantite,
    0
  );

  return (
    <div className="flex h-full flex-col rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-gray-100">Panier</h2>

      {items.length === 0 ? (
        <div className="flex-1 py-12 text-center text-sm text-slate-400 dark:text-gray-500">
          Le panier est vide
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                <th className="px-2 py-2">Médicament</th>
                <th className="px-2 py-2">Quantité</th>
                <th className="px-2 py-2">Prix unitaire</th>
                <th className="px-2 py-2">Sous-total</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-slate-100 dark:border-gray-700">
                  <td className="px-2 py-3 font-medium text-slate-800 dark:text-gray-100">{it.nom}</td>
                  <td className="px-2 py-3">
                    <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-gray-700">
                      <button
                        className="px-2 py-1 text-slate-600 dark:text-gray-300 hover:bg-slate-100"
                        onClick={() => onDec(it.id)}
                      >
                        −
                      </button>
                      <span className="min-w-[2ch] px-2 text-center font-medium">
                        {it.quantite}
                      </span>
                      <button
                        className="px-2 py-1 text-slate-600 dark:text-gray-300 hover:bg-slate-100"
                        onClick={() => onInc(it.id)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3">{formatCurrency(it.prix_vente)}</td>
                  <td className="px-2 py-3 font-semibold text-slate-800 dark:text-gray-100">
                    {formatCurrency(Number(it.prix_vente) * it.quantite)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      onClick={() => onRemove(it.id)}
                      className="text-slate-400 dark:text-gray-500 hover:text-red-600"
                      aria-label="Supprimer"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 border-t border-slate-200 dark:border-gray-700 pt-4">
        <div className="mb-4 flex items-center justify-end gap-3 text-base">
          <span className="text-slate-500 dark:text-gray-400">Total TTC :</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-gray-100">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClear} disabled={!items.length}>
            Vider le panier
          </Button>
          <Button onClick={onConfirm} disabled={!items.length || submitting}>
            {submitting ? "Validation..." : "Confirmer la vente"}
          </Button>
        </div>
      </div>
    </div>
  );
};
