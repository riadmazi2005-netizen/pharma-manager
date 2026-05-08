import { Modal } from "./Modal";
import { Button } from "./Button";

export const ConfirmModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmer", 
  cancelText = "Annuler" 
}) => {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        {cancelText}
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal open={open} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="space-y-4">
        <p className="text-slate-600 dark:text-gray-300">{message}</p>
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Cette action est irréversible.
        </p>
      </div>
    </Modal>
  );
};
