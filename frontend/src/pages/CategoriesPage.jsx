import { useState } from "react";
import { Header } from "../components/common/Header";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { useCategories } from "../hooks/useCategories";

export const CategoriesPage = () => {
  const { categories, loading, error, add, edit, remove } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  
  const [formData, setFormData] = useState({ nom: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, cat: null });

  const openAdd = () => {
    setEditingCat(null);
    setFormData({ nom: "", description: "" });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setFormData({ nom: cat.nom || "", description: cat.description || "" });
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (cat) => {
    setConfirmDelete({ open: true, cat });
  };

  const handleConfirmDelete = async () => {
    const cat = confirmDelete.cat;
    setConfirmDelete({ open: false, cat: null });
    try {
      await remove(cat.id);
    } catch (err) {
      setSubmitError("Erreur lors de la suppression : " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    
    try {
      if (editingCat) {
        await edit(editingCat.id, formData);
      } else {
        await add(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.message || "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <Header title="Catégories" subtitle="Gestion des catégories de médicaments" />
      
      <div className="space-y-6 p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">Liste des catégories</h2>
          <Button onClick={openAdd}>+ Nouvelle catégorie</Button>
        </div>

        {error && <ErrorState message={error} />}

        <div className="rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-sm overflow-x-auto">
          {loading ? (
            <LoadingState />
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-100 dark:border-gray-700 transition-colors hover:bg-slate-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium text-slate-500 dark:text-gray-400">#{cat.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-gray-100">{cat.nom}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{cat.description || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={() => openEdit(cat)}>✏️ Modifier</Button>
                        <Button variant="outline" onClick={() => handleDelete(cat)}>🗑️ Supprimer</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!categories.length && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-sm text-slate-400 dark:text-gray-500">
                      Aucune catégorie trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCat ? "Modifier la catégorie" : "Ajouter une catégorie"}
      >
        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {submitError}
            </div>
          )}
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Nom de la catégorie *</label>
            <input
              required
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Ex: Antibiotiques"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-slate-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="Description optionnelle..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, cat: null })}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message={confirmDelete.cat ? `Voulez-vous vraiment supprimer la catégorie "${confirmDelete.cat.nom}" ? Cette action risque de poser problème si des médicaments y sont liés.` : ""}
      />
    </div>
  );
};

export default CategoriesPage;
