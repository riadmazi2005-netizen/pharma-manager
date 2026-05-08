import { useMemo, useState } from "react";
import { Header } from "../components/common/Header";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { Modal } from "../components/common/Modal";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { fetchVente } from "../api/ventesApi";
import { useVentes } from "../hooks/useVentes";
import { formatCurrency, formatDateTime } from "../utils/format";
import { ConfirmModal } from "../components/common/ConfirmModal";

const PAGE_SIZE = 7;
const STATUSES = ["ALL", "COMPLETEE", "EN_COURS", "ANNULEE"];

export const HistoriqueVentesPage = () => {
  const { ventes, loading, error, cancel } = useVentes();
  const [statut, setStatut] = useState("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedVente, setSelectedVente] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState({ open: false, vente: null });
  const [alertError, setAlertError] = useState({ open: false, message: "" });

  const openDetails = async (id) => {
    setLoadingDetails(true);
    setSelectedVente({ id }); // Open modal immediately with loading state
    try {
      const data = await fetchVente(id);
      setSelectedVente(data);
    } catch (err) {
      setAlertError({ open: true, message: "Erreur lors de la récupération des détails : " + err.message });
      setSelectedVente(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filtered = useMemo(() => {
    return ventes.filter((v) => {
      if (statut !== "ALL" && v.statut !== statut) return false;
      
      const dateStr = v.date_vente || v.date || "";
      if (!dateStr) return true;
      
      const dValue = new Date(dateStr).getTime();
      
      if (from) {
        if (dValue < new Date(from).getTime()) return false;
      }
      if (to) {
        if (dValue > new Date(to).getTime()) return false;
      }
      
      return true;
    });
  }, [ventes, statut, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCancelClick = (v) => {
    setConfirmCancel({ open: true, vente: v });
  };

  const performCancel = async () => {
    const v = confirmCancel.vente;
    setConfirmCancel({ open: false, vente: null });
    await cancel(v.id);
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
              type="datetime-local"
              className="rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700 dark:text-gray-200">Au</span>
            <input
              type="datetime-local"
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
                      <button 
                        onClick={() => openDetails(v.id)}
                        className="hover:underline focus:outline-none transition-colors hover:text-teal-700 dark:hover:text-teal-400"
                      >
                        {v.reference || `INV-${v.id}`}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-gray-200">
                      {formatDateTime(v.date_vente || v.date)}
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
                          onClick={() => handleCancelClick(v)}
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

      {selectedVente && (
        <Modal
          size="lg"
          open={true}
          onClose={() => setSelectedVente(null)}
          title={`Détails de la vente ${selectedVente.reference || `INV-${selectedVente.id}`}`}
        >
          <div className="p-6">
            {loadingDetails && !selectedVente.lignes ? (
              <LoadingState />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div>
                    <span className="block text-slate-500 dark:text-gray-400">Date</span>
                    <span className="font-medium text-slate-800 dark:text-gray-200">
                      {formatDateTime(selectedVente.date_vente || selectedVente.date)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 dark:text-gray-400">Statut</span>
                    <Badge tone={toneFor(selectedVente.statut)}>
                      {formatStatut(selectedVente.statut)}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-slate-500 dark:text-gray-400">Total TTC</span>
                    <span className="font-bold text-lg text-teal-600 dark:text-teal-400">
                      {formatCurrency(selectedVente.total_ttc)}
                    </span>
                  </div>
                  {selectedVente.notes && (
                    <div className="col-span-2 border-t border-slate-200 dark:border-gray-600 pt-3 mt-1">
                      <span className="block text-slate-500 dark:text-gray-400 mb-1">Notes</span>
                      <p className="text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded border border-slate-200 dark:border-gray-600">
                        {selectedVente.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-gray-100 mb-3 border-b border-slate-200 dark:border-gray-700 pb-2">
                    Lignes de commande ({selectedVente.lignes?.length || 0})
                  </h3>
                  {selectedVente.lignes && selectedVente.lignes.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-700">
                          <th className="py-2">Médicament</th>
                          <th className="py-2 text-right">Qté</th>
                          <th className="py-2 text-right">Prix.U</th>
                          <th className="py-2 text-right">Sous-total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                        {selectedVente.lignes.map((ligne) => (
                          <tr key={ligne.id}>
                            <td className="py-3 font-medium text-slate-700 dark:text-gray-200">
                              {/* Le backend peut renvoyer soit l'ID soit l'objet du medicament selon le serializer */}
                              {ligne.medicament_nom || (ligne.medicament && ligne.medicament.nom) || `Med #${ligne.medicament}`}
                            </td>
                            <td className="py-3 text-right text-slate-600 dark:text-gray-300">
                              x{ligne.quantite}
                            </td>
                            <td className="py-3 text-right text-slate-600 dark:text-gray-300">
                              {formatCurrency(ligne.prix_unitaire)}
                            </td>
                            <td className="py-3 text-right font-semibold text-slate-800 dark:text-gray-100">
                              {formatCurrency(ligne.sous_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center text-slate-500 dark:text-gray-400 py-4 text-sm">
                      Détails des lignes indisponibles.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setSelectedVente(null)}>Fermer</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      <ConfirmModal
        open={confirmCancel.open}
        onClose={() => setConfirmCancel({ open: false, vente: null })}
        onConfirm={performCancel}
        title="Confirmer l'annulation"
        message={confirmCancel.vente ? `Voulez-vous vraiment annuler la vente ${confirmCancel.vente.reference || confirmCancel.vente.id} ?` : ""}
      />

      {/* Remplacement du alert classique par une simple modale info (ConfirmModal détournée) */}
      <ConfirmModal
        open={alertError.open}
        onClose={() => setAlertError({ open: false, message: "" })}
        onConfirm={() => setAlertError({ open: false, message: "" })}
        title="Erreur"
        message={alertError.message}
        confirmText="OK"
        cancelText="Fermer"
      />
    </div>
  );
};

export default HistoriqueVentesPage;
