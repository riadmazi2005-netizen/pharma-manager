import { useState } from "react";
import { Header } from "../components/common/Header";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { MedicamentTable } from "../components/medicaments/MedicamentTable";
import { MedicamentForm } from "../components/medicaments/MedicamentForm";
import { useMedicaments } from "../hooks/useMedicaments";
import { useCategories } from "../hooks/useCategories";

export const MedicamentsPage = () => {
  const { medicaments, loading, error, add, edit, remove } = useMedicaments();
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = medicaments.filter((m) => {
    const matchSearch = m.nom?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory ? Number(m.categorie) === Number(selectedCategory) : true;
    return matchSearch && matchCat;
  });

  const onSubmit = async (data) => {
    if (editing) await edit(editing.id, data);
    else await add(data);
    setOpen(false);
    setEditing(null);
  };

  const onDelete = async (m) => {
    if (window.confirm(`Supprimer le médicament "${m.nom}" ?`)) {
      await remove(m.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <Header title="Médicaments" subtitle="Gestion du stock" />
      <div className="space-y-4 p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍  Rechercher..."
              className="w-72 rounded-md border border-slate-300 dark:border-gray-600 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
            <MedicamentTable
              medicaments={filtered.map(m => ({
                ...m,
                categorie_nom: categories?.find(c => c.id === m.categorie)?.nom
              }))}
              onEdit={(m) => {
                setEditing(m);
                setOpen(true);
              }}
              onDelete={onDelete}
            />
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
    </div>
  );
};

export default MedicamentsPage;
