import AppLayout from "@/components/AppLayout";
import KpiCard from "@/components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Wallet, Loader2, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const FluxoCaixa = () => {
  const [pagar, setPagar] = useState(0);
  const [receber, setReceber] = useState(0);
  const [saldoBancario, setSaldoBancario] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [movimentos, setMovimentos] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [{ data: cp }, { data: cr }, { data: mov }, { data: cb }] = await Promise.all([
        supabase.from("contas_pagar").select("valor_original, data_vencimento, status"),
        supabase.from("contas_receber").select("valor_original, data_vencimento, status"),
        supabase.from("movimentos_caixa").select("*").order("data_movimento", { ascending: false }).limit(50),
        supabase.from("contas_bancarias").select("*").eq("ativo", true).order("descricao"),
      ]);

      const cpOpen = (cp || []).filter(c => c.status === "aberto");
      const crOpen = (cr || []).filter(c => c.status === "aberto");
      setPagar(cpOpen.reduce((s, c) => s + Number(c.valor_original), 0));
      setReceber(crOpen.reduce((s, c) => s + Number(c.valor_original), 0));
      setMovimentos(mov || []);
      setContasBancarias(cb || []);
      setSaldoBancario((cb || []).reduce((s: number, c: any) => s + Number(c.saldo_atual), 0));

      // Build projection by month
      const months = new Map<string, { entrada: number; saida: number }>();
      crOpen.forEach(c => {
        const m = c.data_vencimento.substring(0, 7);
        const cur = months.get(m) || { entrada: 0, saida: 0 };
        cur.entrada += Number(c.valor_original);
        months.set(m, cur);
      });
      cpOpen.forEach(c => {
        const m = c.data_vencimento.substring(0, 7);
        const cur = months.get(m) || { entrada: 0, saida: 0 };
        cur.saida += Number(c.valor_original);
        months.set(m, cur);
      });

      let acum = (cb || []).reduce((s: number, c: any) => s + Number(c.saldo_atual), 0);
      setChartData(
        Array.from(months.entries()).sort().map(([mes, v]) => {
          acum += v.entrada - v.saida;
          return { mes, entrada: v.entrada, saida: v.saida, saldo: acum };
        })
      );
      setLoading(false);
    };
    fetch();
  }, []);

  const saldo = receber - pagar;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading">Fluxo de Caixa</h1>
          <p className="text-sm text-muted-foreground">Projeção de entradas e saídas com saldo bancário</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="Saldo Bancário" value={fmt(saldoBancario)} icon={Landmark} trend={saldoBancario >= 0 ? "up" : "down"} trendValue={`${contasBancarias.length} contas`} />
          <KpiCard title="Total a Receber" value={fmt(receber)} icon={ArrowUpCircle} trend="up" trendValue="Em aberto" />
          <KpiCard title="Total a Pagar" value={fmt(pagar)} icon={ArrowDownCircle} trend="down" trendValue="Em aberto" />
          <KpiCard
            title="Saldo Projetado"
            value={fmt(saldoBancario + saldo)}
            icon={saldo >= 0 ? Wallet : TrendingUp}
            trend={saldoBancario + saldo >= 0 ? "up" : "down"}
            trendValue={saldoBancario + saldo >= 0 ? "Positivo" : "Negativo"}
          />
        </div>

        {/* Bank accounts summary */}
        {contasBancarias.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-heading">Saldos por Conta</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Saldo Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contasBancarias.map(cb => (
                    <TableRow key={cb.id}>
                      <TableCell className="font-medium">{cb.descricao}</TableCell>
                      <TableCell>{cb.banco}</TableCell>
                      <TableCell className="capitalize">{cb.tipo}</TableCell>
                      <TableCell className={`text-right font-mono ${Number(cb.saldo_atual) >= 0 ? "text-emerald-500" : "text-destructive"}`}>{fmt(cb.saldo_atual)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-heading">Projeção por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sem dados para projeção</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => fmt(v)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="entrada" name="Entradas" stroke="hsl(142, 72%, 35%)" fill="hsl(142, 72%, 35%)" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="saida" name="Saídas" stroke="hsl(0, 72%, 48%)" fill="hsl(0, 72%, 48%)" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="saldo" name="Saldo Acumulado" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent movements */}
        {movimentos.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-heading">Últimos Movimentos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentos.slice(0, 20).map(m => (
                    <TableRow key={m.id}>
                      <TableCell>{new Date(m.data_movimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="font-medium">{m.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={m.tipo === "entrada" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                          {m.tipo === "entrada" ? "ENTRADA" : "SAÍDA"}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono ${m.tipo === "entrada" ? "text-emerald-500" : "text-destructive"}`}>
                        {fmt(m.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default FluxoCaixa;
