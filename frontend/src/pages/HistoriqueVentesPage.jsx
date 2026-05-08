import { useMemo, useState } from "react";
import { Header } from "../components/common/Header";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { useVentes } from "../hooks/useVentes";
import { formatCurrency, formatDate } from "../utils/format";

const PAGE_SIZE = 7;
const STATUSES = ["ALL", "COMPLETEE", "EN_COURS", "ANNULEE"];

export const HistoriqueVentesPage = () => {
  const { ventes, loading, error, cancel } = useVentes();
  const [statut, setStatut] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ventes.filter((v) => {
      if (statut !== "ALL" && v.statut !== statut) return false;
      const d = (v.date_vente || v.date || "").slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [ventes, statut, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCancel = async (v) => {
    if (window.confirm(`Annuler la vente ${v.reference || v.id} ?`)) {
      await cancel(v.id);
    }
  };

  const toneFor = (s) =>
    s === "COMPLETEE" ? "green" : s === "ANNULEE" ? "red" : "orange";

  const formatStatut = (s) => {
    switch (s) {
      case "EN_COURS": return "En cours";
      case "COMPLETEE": return "Complétée";
      case "ANNULEE": return "Annulée";
      default: return s || "—";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <Header title="Historique des ventes" subtitle="Toutes les transactions" />
      <div className="space-y-4 p-8">
        <div className="flex flex-wrap items-end gap-4 rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-gray-200">Statut</span>
            <select
              className="rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm"
              value={statut}
              onChange={(e) => {
                setStatut(e.target.value);
                setPage(1);
              }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "Tous" : formatStatut(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-gray-200">Du</span>
            <input
              type="date"
              className="rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-gray-200">Au</span>
            <input
              type="date"
              className="rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <Button
            onClick={() => {
              setPage(1);
            }}
          >
            Filtrer
          </Button>
        </div>

        {error && <ErrorState message={error} />}

        <div className="rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-sm">
          {loading ? (
            <LoadingState />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  <th className="px-4 py-3">Référence</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((v) => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-100 dark:border-gray-700 transition-colors hover:bg-slate-50 dark:bg-gray-700"
                  >
                    <td className="px-4 py-3 font-medium text-teal-600">
                      {v.reference || `INV-${v.id}`}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-gray-200">
                      {formatDate(v.date_vente || v.date)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-gray-100">
                      {formatCurrency(v.total_ttc)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={toneFor(v.statut)}>{formatStatut(v.statut)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.statut === "EN_COURS" && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(v)}
                        >
                          ↻ Annuler
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {!pageItems.length && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-slate-400 dark:text-gray-500">
                      Aucune vente trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-700 px-4 py-3 text-sm text-slate-600 dark:text-gray-300">
            <div>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹ Précédent
              </Button>
              <span className="rounded-md bg-teal-600 px-3 py-1 font-medium text-white">
                {page}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Suivant ›
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueVentesPage;
