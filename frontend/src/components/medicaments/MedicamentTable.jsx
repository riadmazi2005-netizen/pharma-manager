import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/format";

export const MedicamentTable = ({ medicaments, onEdit, onDelete }) => {
  if (!medicaments?.length) {
    return (
      <div className="py-10 text-center text-sm text-slate-400 dark:text-gray-500">
        Aucun médicament trouvé
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Stock actuel</th>
            <th className="px-4 py-3">Stock min.</th>
            <th className="px-4 py-3">Prix vente</th>
            <th className="px-4 py-3">Ordonnance</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((m) => {
            const lowStock = Number(m.stock_actuel) <= Number(m.stock_minimum);
            return (
              <tr
                key={m.id}
                className="border-b border-slate-100 dark:border-gray-700 transition-colors hover:bg-slate-50 dark:bg-gray-700"
              >
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-gray-100">{m.nom}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">
                  {m.categorie?.nom || m.categorie_nom || m.categorie || "-"}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-gray-200">{m.stock_actuel}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-gray-200">{m.stock_minimum}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-gray-200">
                  {formatCurrency(m.prix_vente)}
                </td>
                <td className="px-4 py-3">
                  {m.ordonnance_requise ? (
                    <Badge tone="yellow">⚠️ Oui</Badge>
                  ) : (
                    <Badge tone="slate">Non</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={lowStock ? "red" : "green"}>
                    {lowStock ? "Stock faible" : "En stock"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onEdit(m)}>
                      Modifier
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(m)}>
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
