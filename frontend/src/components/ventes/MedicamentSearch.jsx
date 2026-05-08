import { useState } from "react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { formatCurrency } from "../../utils/format";

export const MedicamentSearch = ({ medicaments, onAdd }) => {
  const [q, setQ] = useState("");
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, val) => {
    setQuantities(prev => ({ ...prev, [id]: val }));
  };

  const filtered = medicaments.filter((m) =>
    m.nom?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-gray-100">Nouvelle vente</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍  Rechercher un médicament..."
        className="mb-4 w-full rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
        {filtered.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-gray-100">
                {m.nom}
                {m.est_en_alerte && Number(m.stock_actuel) > 0 && (
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400 px-2 py-0.5 rounded-full">
                    STOCK FAIBLE
                  </span>
                )}
                {Number(m.stock_actuel) <= 0 && (
                  <Badge tone="red">Rupture</Badge>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400">
                Stock: {m.stock_actuel} · {formatCurrency(m.prix_vente)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number"
                min="1"
                max={m.stock_actuel}
                value={quantities[m.id] || 1}
                onChange={(e) => handleQtyChange(m.id, parseInt(e.target.value) || 1)}
                className="w-16 rounded-md border border-slate-300 dark:border-gray-600 px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                disabled={Number(m.stock_actuel) <= 0}
              />
              <Button
                onClick={() => {
                  onAdd(m, quantities[m.id] || 1);
                  handleQtyChange(m.id, 1);
                }}
                disabled={Number(m.stock_actuel) <= 0}
              >
                Ajouter
              </Button>
            </div>
          </li>
        ))}
        {!filtered.length && (
          <li className="py-6 text-center text-sm text-slate-400 dark:text-gray-500">
            Aucun résultat
          </li>
        )}
      </ul>
    </div>
  );
};
