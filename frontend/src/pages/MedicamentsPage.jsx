import { useState, useEffect } from "react";
import { Header } from "../components/common/Header";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { MedicamentTable } from "../components/medicaments/MedicamentTable";
import { MedicamentForm } from "../components/medicaments/MedicamentForm";
import { useMedicaments } from "../hooks/useMedicaments";
import { useCategories } from "../hooks/useCategories";
import { ConfirmModal } from "../components/common/ConfirmModal";

export const MedicamentsPage = () => {
  const { medicaments, loading, error, pagination, reload, add, edit, remove } = useMedicaments(false);
  const { categories } = useCategories();
  
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, medicament: null });

  // Re-fetch automatically from API backend with valid query params
  useEffect(() => {
    const params = { page };
    if (search) params.search = search;
    if (selectedCategory) params.categorie = selectedCategory;
    reload(params);
  }, [page, search, selectedCategory, reload]);

  const onSubmit = async (data) => {
    if (editing) await edit(editing.id, data);
    else await add(data);
    setOpen(false);
    setEditing(null);
  };

  const onDelete = (m) => {
    setConfirmDelete({ open: true, medicament: m });
  };

  const handleConfirmDelete = async () => {
    const m = confirmDelete.medicament;
    setConfirmDelete({ open: false, medicament: null });
    await remove(m.id);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <Header title="Médicaments" subtitle="Gestion du stock" />
      <div className="space-y-4 p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="🔍  Rechercher..."
              className="w-72 rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Toutes les catégories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            + Ajouter un médicament
          </Button>
        </div>

        {error && <ErrorState message={error} />}

        <div className="rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-sm">
          {loading ? <LoadingState /> : (
            <>
              <MedicamentTable
                medicaments={medicaments.map(m => ({
                  ...m,
                  categorie_nom: categories?.find(c => c.id === m.categorie)?.nom
                }))}
                onEdit={(m) => {
                  setEditing(m);
                  setOpen(true);
                }}
                onDelete={onDelete}
              />
              
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-700 px-4 py-3 text-sm text-slate-600 dark:text-gray-300">
                <div>
                  {pagination?.count || medicaments.length} médicament{(pagination?.count || medicaments.length) > 1 ? "s" : ""} au total
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!pagination?.previous}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    ‹ Précédent
                  </Button>
                  <span className="rounded-md bg-teal-600 px-3 py-1 font-medium text-white shadow-sm">
                    {page}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination?.next}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Suivant ›
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        title={editing ? "Modifier le médicament" : "Ajouter un médicament"}
        size="lg"
      >
        <MedicamentForm
          initial={editing}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={() => {
            setOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmModal
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, medicament: null })}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message={confirmDelete.medicament ? `Voulez-vous vraiment supprimer le médicament "${confirmDelete.medicament.nom}" ?` : ""}
      />
    </div>
  );
};

export default MedicamentsPage;
