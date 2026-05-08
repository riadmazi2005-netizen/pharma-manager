export const Modal = ({ open, onClose, title, children, footer, size = "md" }) => {
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${widths[size]} rounded-lg bg-white dark:bg-gray-800 dark:text-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-gray-500 transition hover:text-slate-700 dark:text-gray-200"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
