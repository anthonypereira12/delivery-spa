import { useEffect, useState } from "react";
import { useAuth } from "../../state/AuthContext";
import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis, VictoryTheme, VictoryLine, VictoryTooltip } from "victory";

export default function AdminAnalytics() {
  const { api, user } = useAuth();
  const [byStatus, setByStatus] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [byDay, setByDay] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      api("/analytics/orders-by-status").then(setByStatus);
      api("/analytics/revenue-by-restaurant").then(setRevenue);
      api("/analytics/orders-by-day").then(setByDay);
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") return <div className="card">Acesso restrito.</div>;

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente", CONFIRMED: "Confirmado", PREPARING: "Preparando",
    OUT_FOR_DELIVERY: "A caminho", DELIVERED: "Entregue", CANCELED: "Cancelado",
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Analises</h1>

      <div className="card">
        <h2 className="font-semibold mb-2">Pedidos por Status</h2>
        <VictoryPie
          data={byStatus.map(s => ({ x: statusLabels[s.status] || s.status, y: s.count }))}
          labelComponent={<VictoryTooltip />}
        />
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Faturamento por Restaurante (R$)</h2>
        <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
          <VictoryAxis tickFormat={(t) => (""+t).length > 10 ? (""+t).slice(0,10) + "…" : t} />
          <VictoryAxis dependentAxis tickFormat={(t) => (Number(t)/100).toLocaleString("pt-BR")} />
          <VictoryBar
            data={revenue.map(r => ({ x: r.restaurant, y: r.totalCents }))}
            labels={({ datum }) => (datum.y/100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Pedidos por Dia (14 dias)</h2>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis tickFormat={(t) => new Date(t as any).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} />
          <VictoryAxis dependentAxis />
          <VictoryLine
            data={byDay.map(d => ({ x: d.date, y: d.count }))}
            labels={({ datum }) => `${datum.y} pedido(s)`}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </div>
    </section>
  );
}
