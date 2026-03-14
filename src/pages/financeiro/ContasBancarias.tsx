import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Loader2, Landmark, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import KpiCard from "@/components/KpiCard";

const ContasBancarias = () => {
  const { profile } = useAuth();
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    banco: "", agencia: "", conta: "", tipo: "corrente", descricao: "", saldo_inicial: "0",
  });

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase.from("contas_bancarias").select("*").order("descricao");
    setContas(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setForm({ banco: "", agencia: "", conta: "", tipo: "corrente", descricao: "", saldo_inicial: "0" });
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const payload = {
      tenant_id: profile.tenant_id, empresa_id: profile.empresa_id,
      banco: form.banco, agencia: form.agencia || null, conta: form.conta || null,
      tipo: form.tipo, descricao: form.descricao,
      saldo_inicial: parseFloat(form.saldo_inicial),
      saldo_atual: editId ? undefined : parseFloat(form.saldo_inicial),
    };
    const { error } = editId
      ? await supabase.from("contas_bancarias").update(payload).eq("id", editId)
      : await supabase.from("contas_bancarias").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editId ? "Conta atualizada!" : "Conta cadastrada!"); setDialogOpen(false); resetForm(); fetchAll(); }
    setSaving(false);
  };

  const openEdit = (c: any) => {
    setEditId(c.id);
    setForm({
      banco: c.banco, agencia: c.agencia || "", conta: c.conta || "",
      tipo: c.tipo, descricao: c.descricao, saldo_inicial: String(c.saldo_inicial),
    });
    setDialogOpen(true);
  };

  const formatCurrency = (v: number | null) =>
    v != null ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";

  const totalSaldo = contas.reduce((s, c) => s + Number(c.saldo_atual), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading">Contas Bancárias</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas contas bancárias</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Nova Conta</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-heading">{editId ? "Editar" : "Nova"} Conta Bancária</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Banco *</Label>
                    <Input value={form.banco} onChange={e => setForm(f => ({ ...f, banco: e.target.value }))} required placeholder="Ex: Banco do Brasil" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Conta Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="caixa">Caixa Interno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição *</Label>
                  <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} required placeholder="Ex: CC Banco do Brasil - Matriz" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Agência</Label>
                    <Input value={form.agencia} onChange={e => setForm(f => ({ ...f, agencia: e.target.value }))} placeholder="0001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Conta</Label>
                    <Input value={form.conta} onChange={e => setForm(f => ({ ...f, conta: e.target.value }))} placeholder="12345-6" />
                  </div>
                  <div className="space-y-2">
                    <Label>Saldo Inicial (R$)</Label>
                    <Input type="number" step="0.01" value={form.saldo_inicial} onChange={e => setForm(f => ({ ...f, saldo_inicial: e.target.value }))} />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Salvar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KpiCard title="Total de Contas" value={String(contas.length)} icon={Landmark} trend="neutral" trendValue="Ativas" />
          <KpiCard title="Saldo Total" value={formatCurrency(totalSaldo)} icon={Landmark} trend={totalSaldo >= 0 ? "up" : "down"} trendValue={totalSaldo >= 0 ? "Positivo" : "Negativo"} />
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : contas.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhuma conta bancária cadastrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Banco</TableHead>
                    <TableHead>Agência/Conta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Saldo Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contas.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.descricao}</TableCell>
                      <TableCell>{c.banco}</TableCell>
                      <TableCell>{[c.agencia, c.conta].filter(Boolean).join(" / ") || "—"}</TableCell>
                      <TableCell className="capitalize">{c.tipo}</TableCell>
                      <TableCell className={Number(c.saldo_atual) >= 0 ? "text-emerald-500" : "text-destructive"}>{formatCurrency(c.saldo_atual)}</TableCell>
                      <TableCell><Badge variant="outline" className={c.ativo ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>{c.ativo ? "ATIVA" : "INATIVA"}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ContasBancarias;
