const tones = {
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  gray: "bg-slate-100 text-slate-700 dark:text-gray-200",
};

export const Badge = ({ children, tone = "gray" }) => (
  <span
    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${tones[tone]}`}
  >
    {children}
  </span>
);
