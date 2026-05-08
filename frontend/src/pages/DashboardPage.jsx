import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Header } from "../components/common/Header";
import { Badge } from "../components/common/Badge";
import { LoadingState, ErrorState } from "../components/common/StateViews";
import { useMedicaments } from "../hooks/useMedicaments";
import { useVentes } from "../hooks/useVentes";
import { formatCurrency, formatDate } from "../utils/format";

const Card = ({ label, value, tone = "blue" }) => {
  const tones = {
    blue: "from-sky-500 to-sky-600",
    red: "from-red-500 to-red-600",
    teal: "from-teal-500 to-teal-600",
  };
  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${tones[tone]} p-5 text-white shadow-sm`}
    >
      <div className="text-sm opacity-90">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
};

export const DashboardPage = () => {
  const { alertes, loading: lm, error: em } = useMedicaments();
  const { ventes, loading: lv, error: ev } = useVentes();

  const today = new Date().toISOString().slice(0, 10);
  const ventesDuJour = useMemo(
    () => ventes.filter((v) => (v.date_vente || v.date || "").startsWith(today)),
    [ventes, today]
  );
  const ca = ventesDuJour.reduce((a, v) => a + Number(v.total_ttc || 0), 0);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      data.push({ date: dateStr, total: 0 });
    }
    
    ventes.forEach((v) => {
      const vDate = (v.date_vente || v.date || "").slice(0, 10);
      const day = data.find((d) => d.date === vDate);
      if (day) {
        day.total += Number(v.total_ttc || 0);
      }
    });

    return data.map((d) => ({
      name: new Date(d.date).toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'short' }),
      total: d.total
    }));
  }, [ventes]);

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
      <Header title="Tableau de bord" subtitle="Vue d'ensemble de la pharmacie" />
      <div className="space-y-6 p-8">
        {(em || ev) && <ErrorState message={em || ev} />}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card label="Ventes du jour" value={ventesDuJour.length} tone="blue" />
          <Card label="Chiffre d'affaires" value={formatCurrency(ca)} tone="teal" />
          <Card label="Alertes stock" value={alertes.length} tone="red" />
        </div>

        <section className="rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-gray-100">
            Évolution des ventes — 7 derniers jours
          </h2>
          {lv ? (
            <LoadingState />
          ) : (
            <div className="w-full">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value} MAD`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`${value} MAD`, "Ventes"]}
                  />
                  <Bar dataKey="total" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-gray-100">
              Médicaments en alerte
            </h2>
            {lm ? (
              <LoadingState />
            ) : alertes.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-400 dark:text-gray-500">
                Aucune alerte
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {alertes.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-gray-100">{m.nom}</div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">
                        Stock : {m.stock_actuel} / min {m.stock_minimum}
                      </div>
                    </div>
                    <Badge tone="red">Stock faible</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg bg-white dark:bg-gray-800 dark:text-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-gray-100">
              Ventes récentes
            </h2>
            {lv ? (
              <LoadingState />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-700 text-left text-xs uppercase text-slate-500 dark:text-gray-400">
                    <th className="py-2">Date</th>
                    <th className="py-2">Référence</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.slice(0, 6).map((v) => (
                    <tr key={v.id} className="border-b border-slate-100 dark:border-gray-700">
                      <td className="py-2 text-slate-600 dark:text-gray-300">
                        {formatDate(v.date_vente || v.date)}
                      </td>
                      <td className="py-2 font-medium text-teal-600">
                        {v.reference || `INV-${v.id}`}
                      </td>
                      <td className="py-2">{formatCurrency(v.total_ttc)}</td>
                      <td className="py-2">
                        <Badge
                          tone={
                            v.statut === "COMPLETEE"
                              ? "green"
                              : v.statut === "ANNULEE"
                                ? "red"
                                : "orange"
                          }
                        >
                          {formatStatut(v.statut)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {!ventes.length && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 dark:text-gray-500">
                        Aucune vente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
