const variants = {
  primary:
    "bg-teal-600 hover:bg-teal-700 text-white shadow-sm",
  secondary:
    "bg-white dark:bg-gray-800 dark:text-white border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:bg-gray-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "text-slate-600 dark:text-gray-300 hover:bg-slate-100",
  outline: "border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:bg-gray-700",
};

export const Button = ({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
