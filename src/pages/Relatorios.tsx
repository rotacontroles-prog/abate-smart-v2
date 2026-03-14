import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import KpiCard from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowDownCircle, ArrowUpCircle, TrendingUp, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const COLORS = [
  "hsl(0, 72%, 48%)", "hsl(32, 95%, 52%)", "hsl(142, 72%, 35%)",
  "hsl(220, 70%, 50%)", "hsl(280, 65%, 60%)", "hsl(38, 92%, 50%)",
];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Relatorios = () => {
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 6);
    return d.toISOString().split("T")[0];
  });
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().split("T")[0]);
  const [kpis, setKpis] = useState({ totalPagar: 0, totalReceber: 0, pagoMes: 0, recebidoMes: 0 });
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: cp }, { data: cr }] = await Promise.all([
      supabase.from("contas_pagar").select("*").gte("data_vencimento", dataInicio).lte("data_vencimento", dataFim),
      supabase.from("contas_receber").select("*").gte("data_vencimento", dataInicio).lte("data_vencimento", dataFim),
    ]);

    const contasPagar = cp || [];
    const contasReceber = cr || [];

    // KPIs
    const totalPagar = contasPagar.filter(c => c.status === "aberto").reduce((s, c) => s + Number(c.valor_original), 0);
    const totalReceber = contasReceber.filter(c => c.status === "aberto").reduce((s, c) => s + Number(c.valor_original), 0);
    const now = new Date();
    const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const pagoMes = contasPagar.filter(c => c.status === "pago" && c.data_pagamento?.startsWith(mesAtual)).reduce((s, c) => s + Number(c.valor_pago || 0), 0);
    const recebidoMes = contasReceber.filter(c => c.status === "recebido" && c.data_recebimento?.startsWith(mesAtual)).reduce((s, c) => s + Number(c.valor_recebido || 0), 0);
    setKpis({ totalPagar, totalReceber, pagoMes, recebidoMes });

    // Bar chart - by month
    const months = new Map<string, { pagar: number; receber: number }>();
    contasPagar.forEach(c => {
      const m = c.data_vencimento.substring(0, 7);
      const cur = months.get(m) || { pagar: 0, receber: 0 };
      cur.pagar += Number(c.valor_original);
      months.set(m, cur);
    });
    contasReceber.forEach(c => {
      const m = c.data_vencimento.substring(0, 7);
      const cur = months.get(m) || { pagar: 0, receber: 0 };
      cur.receber += Number(c.valor_original);
      months.set(m, cur);
    });
    setBarData(Array.from(months.entries()).sort().map(([mes, v]) => ({ mes, ...v })));

    // Pie chart - payment methods
    const formas = new Map<string, number>();
    [...contasPagar, ...contasReceber].forEach(c => {
      const f = c.forma_pagamento || "Não informado";
      formas.set(f, (formas.get(f) || 0) + Number(c.valor_original));
    });
    setPieData(Array.from(formas.entries()).map(([name, value]) => ({ name, value })));

    // Line chart - cash flow evolution
    const flow = new Map<string, number>();
    contasReceber.filter(c => c.status === "recebido").forEach(c => {
      const m = (c.data_recebimento || c.data_vencimento).substring(0, 7);
      flow.set(m, (flow.get(m) || 0) + Number(c.valor_recebido || c.valor_original));
    });
    contasPagar.filter(c => c.status === "pago").forEach(c => {
      const m = (c.data_pagamento || c.data_vencimento).substring(0, 7);
      flow.set(m, (flow.get(m) || 0) - Number(c.valor_pago || c.valor_original));
    });
    let acum = 0;
    setLineData(Array.from(flow.entries()).sort().map(([mes, v]) => { acum += v; return { mes, saldo: acum }; }));

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [dataInicio, dataFim]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Análise financeira e indicadores</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <Label className="text-xs">De</Label>
              <Input type="date" className="w-36" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Até</Label>
              <Input type="date" className="w-36" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard title="A Pagar (Aberto)" value={fmt(kpis.totalPagar)} icon={ArrowDownCircle} trend="down" trendValue="Em aberto" />
              <KpiCard title="A Receber (Aberto)" value={fmt(kpis.totalReceber)} icon={ArrowUpCircle} trend="up" trendValue="Em aberto" />
              <KpiCard title="Pago no Mês" value={fmt(kpis.pagoMes)} icon={DollarSign} />
              <KpiCard title="Recebido no Mês" value={fmt(kpis.recebidoMes)} icon={TrendingUp} trend="up" trendValue="Mês atual" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base font-heading">Pagar vs Receber por Mês</CardTitle></CardHeader>
                <CardContent>
                  {barData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados no período</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                        <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                        <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" }} />
                        <Legend />
                        <Bar dataKey="pagar" name="A Pagar" fill="hsl(0, 72%, 48%)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="receber" name="A Receber" fill="hsl(142, 72%, 35%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-base font-heading">Formas de Pagamento</CardTitle></CardHeader>
                <CardContent>
                  {pieData.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados no período</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" }} formatter={(v: any) => fmt(v as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader><CardTitle className="text-base font-heading">Evolução do Fluxo de Caixa</CardTitle></CardHeader>
              <CardContent>
                {lineData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Sem movimentações no período</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                      <XAxis dataKey="mes" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" }} formatter={(v: any) => fmt(v as number)} />
                      <Line type="monotone" dataKey="saldo" name="Saldo Acumulado" stroke="hsl(32, 95%, 52%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(32, 95%, 52%)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Relatorios;
