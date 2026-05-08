import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
  const items = [
    { href: "/", label: "Tableau de bord", icon: "🏠" },
    { href: "/medicaments", label: "Médicaments", icon: "💊" },
    { href: "/categories", label: "Catégories", icon: "📁" },
    { href: "/ventes", label: "Ventes", icon: "🛒" },
    { href: "/historique", label: "Historique des ventes", icon: "📋" },
  ];

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#1e3a5f] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain drop-shadow-md" />
        <span className="text-lg font-semibold tracking-tight">Projet Pharma</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {items.map((it) => (
          <NavLink
            key={it.href}
            to={it.href}
            end={it.href === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? "bg-white/15 font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-base">{it.icon}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 px-6 py-4 text-xs text-white/60">
        © Projet Pharma
      </div>
    </aside>
  );
};
