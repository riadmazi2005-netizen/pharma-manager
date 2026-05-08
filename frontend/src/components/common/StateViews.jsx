export const LoadingState = ({ message = "Chargement..." }) => (
  <div className="flex items-center justify-center py-12 text-sm text-slate-500 dark:text-gray-400">
    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 dark:border-gray-600 border-t-teal-600" />
    {message}
  </div>
);

export const ErrorState = ({ message }) => (
  <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    ⚠️ {message || "Une erreur est survenue"}
  </div>
);

export const EmptyState = ({ message = "Aucune donnée" }) => (
  <div className="py-10 text-center text-sm text-slate-400 dark:text-gray-500">{message}</div>
);
