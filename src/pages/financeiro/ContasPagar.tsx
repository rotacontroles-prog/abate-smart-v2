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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Loader2, Split } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CONDICOES = [
  { value: "a_vista", label: "À Vista", parcelas: 1, intervalo: 0 },
  { value: "30dd", label: "30 dias", parcelas: 1, intervalo: 30 },
  { value: "30_60", label: "30/60 dias", parcelas: 2, intervalo: 30 },
  { value: "30_60_90", label: "30/60/90 dias", parcelas: 3, intervalo: 30 },
  { value: "30_60_90_120", label: "30/60/90/120 dias", parcelas: 4, intervalo: 30 },
  { value: "personalizado", label: "Personalizado", parcelas: 1, intervalo: 30 },
];

const ContasPagar = () => {
  const { profile } = useAuth();
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [parcelaDialogOpen, setParcelaDialogOpen] = useState(false);
  const [baixaDialogOpen, setBaixaDialogOpen] = useState(false);
  const [baixaConta, setBaixaConta] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [planoContas, setPlanoContas] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [form, setForm] = useState({
    descricao: "", valor_original: "", data_vencimento: "",
    forma_pagamento: "boleto", observacoes: "", pessoa_id: "", plano_conta_id: "", conta_bancaria_id: "",
  });
  const [parcelaForm, setParcelaForm] = useState({
    descricao: "", valor_total: "", condicao: "30_60_90", parcelas_custom: "3",
    intervalo_custom: "30", data_primeira: "", forma_pagamento: "boleto",
    pessoa_id: "", plano_conta_id: "", conta_bancaria_id: "", observacoes: "",
  });
  const [baixaForm, setBaixaForm] = useState({
    valor_pago: "", valor_juros: "0", valor_multa: "0", valor_desconto: "0",
    forma_pagamento: "boleto", conta_bancaria_id: "",
  });

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: c }, { data: p }, { data: pc }, { data: cb }] = await Promise.all([
      supabase.from("contas_pagar").select("*, pessoas(razao_social)").order("data_vencimento", { ascending: true }),
      supabase.from("pessoas").select("id, razao_social").contains("tipo", ["fornecedor"]).order("razao_social"),
      supabase.from("plano_contas").select("id, codigo, descricao").eq("sintetica", false).order("codigo"),
      supabase.from("contas_bancarias").select("id, descricao, banco").eq("ativo", true).order("descricao"),
    ]);
    setContas(c || []);
    setPessoas(p || []);
    setPlanoContas(pc || []);
    setContasBancarias(cb || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => setForm({ descricao: "", valor_original: "", data_vencimento: "", forma_pagamento: "boleto", observacoes: "", pessoa_id: "", plano_conta_id: "", conta_bancaria_id: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const { error } = await supabase.from("contas_pagar").insert({
      tenant_id: profile.tenant_id, empresa_id: profile.empresa_id,
      descricao: form.descricao, valor_original: parseFloat(form.valor_original),
      data_vencimento: form.data_vencimento, forma_pagamento: form.forma_pagamento,
      observacoes: form.observacoes || null,
      pessoa_id: form.pessoa_id || null, plano_conta_id: form.plano_conta_id || null,
      conta_bancaria_id: form.conta_bancaria_id || null,
      condicao_pagamento: "a_vista", parcela_numero: 1, parcela_total: 1,
    });
    if (error) toast.error(error.message);
    else { toast.success("Conta cadastrada!"); setDialogOpen(false); resetForm(); fetchAll(); }
    setSaving(false);
  };

  const handleParcelar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const cond = CONDICOES.find(c => c.value === parcelaForm.condicao);
    const numParcelas = parcelaForm.condicao === "personalizado" ? parseInt(parcelaForm.parcelas_custom) : (cond?.parcelas || 1);
    const intervalo = parcelaForm.condicao === "personalizado" ? parseInt(parcelaForm.intervalo_custom) : (cond?.intervalo || 30);

    const { error } = await supabase.rpc("gerar_parcelas_cp", {
      p_tenant_id: profile.tenant_id,
      p_empresa_id: profile.empresa_id,
      p_descricao: parcelaForm.descricao,
      p_valor_total: parseFloat(parcelaForm.valor_total),
      p_num_parcelas: numParcelas,
      p_data_primeira_parcela: parcelaForm.data_primeira,
      p_intervalo_dias: intervalo,
      p_forma_pagamento: parcelaForm.forma_pagamento,
      p_pessoa_id: parcelaForm.pessoa_id || null,
      p_plano_conta_id: parcelaForm.plano_conta_id || null,
      p_conta_bancaria_id: parcelaForm.conta_bancaria_id || null,
      p_observacoes: parcelaForm.observacoes || null,
    });
    if (error) toast.error(error.message);
    else { toast.success(`${numParcelas} parcelas geradas!`); setParcelaDialogOpen(false); fetchAll(); }
    setSaving(false);
  };

  const openBaixa = (c: any) => {
    setBaixaConta(c);
    setBaixaForm({
      valor_pago: String(c.valor_original), valor_juros: "0", valor_multa: "0",
      valor_desconto: "0", forma_pagamento: c.forma_pagamento || "boleto",
      conta_bancaria_id: c.conta_bancaria_id || "",
    });
    setBaixaDialogOpen(true);
  };

  const handleBaixa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baixaConta) return;
    setSaving(true);
    const { error } = await supabase.from("contas_pagar").update({
      status: "pago",
      valor_pago: parseFloat(baixaForm.valor_pago),
      valor_juros: parseFloat(baixaForm.valor_juros),
      valor_multa: parseFloat(baixaForm.valor_multa),
      valor_desconto: parseFloat(baixaForm.valor_desconto),
      forma_pagamento: baixaForm.forma_pagamento,
      conta_bancaria_id: baixaForm.conta_bancaria_id || null,
      data_pagamento: new Date().toISOString().split("T")[0],
    }).eq("id", baixaConta.id);
    if (error) toast.error(error.message);
    else { toast.success("Baixa realizada!"); setBaixaDialogOpen(false); fetchAll(); }
    setSaving(false);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      aberto: "bg-warning/10 text-warning border-warning/20",
      pago: "bg-success/10 text-success border-success/20",
      vencido: "bg-destructive/10 text-destructive border-destructive/20",
      cancelado: "bg-muted text-muted-foreground",
    };
    return <Badge variant="outline" className={map[status] || ""}>{status.toUpperCase()}</Badge>;
  };

  const formatCurrency = (v: number | null) =>
    v != null ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—";

  const SelectContaBancaria = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
      <SelectContent>
        {contasBancarias.map(cb => <SelectItem key={cb.id} value={cb.id}>{cb.descricao} ({cb.banco})</SelectItem>)}
      </SelectContent>
    </Select>
  );

  const SelectFormaPgto = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="boleto">Boleto</SelectItem>
        <SelectItem value="pix">PIX</SelectItem>
        <SelectItem value="dinheiro">Dinheiro</SelectItem>
        <SelectItem value="transferencia">Transferência</SelectItem>
        <SelectItem value="cheque">Cheque</SelectItem>
        <SelectItem value="cartao">Cartão</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading">Contas a Pagar</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas obrigações financeiras</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={parcelaDialogOpen} onOpenChange={setParcelaDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Split className="h-4 w-4 mr-2" />Parcelar</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="font-heading">Gerar Parcelas</DialogTitle></DialogHeader>
                <form onSubmit={handleParcelar} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição *</Label>
                    <Input value={parcelaForm.descricao} onChange={e => setParcelaForm(f => ({ ...f, descricao: e.target.value }))} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Total (R$) *</Label>
                      <Input type="number" step="0.01" value={parcelaForm.valor_total} onChange={e => setParcelaForm(f => ({ ...f, valor_total: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Condição</Label>
                      <Select value={parcelaForm.condicao} onValueChange={v => setParcelaForm(f => ({ ...f, condicao: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CONDICOES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {parcelaForm.condicao === "personalizado" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nº Parcelas</Label>
                        <Input type="number" min="1" max="48" value={parcelaForm.parcelas_custom} onChange={e => setParcelaForm(f => ({ ...f, parcelas_custom: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Intervalo (dias)</Label>
                        <Input type="number" min="7" max="90" value={parcelaForm.intervalo_custom} onChange={e => setParcelaForm(f => ({ ...f, intervalo_custom: e.target.value }))} />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>1ª Parcela (data) *</Label>
                      <Input type="date" value={parcelaForm.data_primeira} onChange={e => setParcelaForm(f => ({ ...f, data_primeira: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Forma Pgto</Label>
                      <SelectFormaPgto value={parcelaForm.forma_pagamento} onChange={v => setParcelaForm(f => ({ ...f, forma_pagamento: v }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fornecedor</Label>
                      <Select value={parcelaForm.pessoa_id} onValueChange={v => setParcelaForm(f => ({ ...f, pessoa_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {pessoas.map(p => <SelectItem key={p.id} value={p.id}>{p.razao_social}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Conta Bancária</Label>
                      <SelectContaBancaria value={parcelaForm.conta_bancaria_id} onChange={v => setParcelaForm(f => ({ ...f, conta_bancaria_id: v }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Input value={parcelaForm.observacoes} onChange={e => setParcelaForm(f => ({ ...f, observacoes: e.target.value }))} />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Gerar Parcelas
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Nova Conta</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="font-heading">Nova Conta a Pagar</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição *</Label>
                    <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} required maxLength={200} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fornecedor</Label>
                      <Select value={form.pessoa_id} onValueChange={v => setForm(f => ({ ...f, pessoa_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {pessoas.map(p => <SelectItem key={p.id} value={p.id}>{p.razao_social}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Conta Bancária</Label>
                      <SelectContaBancaria value={form.conta_bancaria_id} onChange={v => setForm(f => ({ ...f, conta_bancaria_id: v }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Plano de Contas</Label>
                    <Select value={form.plano_conta_id} onValueChange={v => setForm(f => ({ ...f, plano_conta_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {planoContas.map(pc => <SelectItem key={pc.id} value={pc.id}>{pc.codigo} - {pc.descricao}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor (R$) *</Label>
                      <Input type="number" step="0.01" value={form.valor_original} onChange={e => setForm(f => ({ ...f, valor_original: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento *</Label>
                      <Input type="date" value={form.data_vencimento} onChange={e => setForm(f => ({ ...f, data_vencimento: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Forma de Pagamento</Label>
                    <SelectFormaPgto value={form.forma_pagamento} onChange={v => setForm(f => ({ ...f, forma_pagamento: v }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Input value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} maxLength={500} />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Salvar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Baixa Dialog */}
        <Dialog open={baixaDialogOpen} onOpenChange={setBaixaDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Dar Baixa</DialogTitle></DialogHeader>
            <form onSubmit={handleBaixa} className="space-y-4">
              <p className="text-sm text-muted-foreground">Valor original: {formatCurrency(baixaConta?.valor_original)}</p>
              {baixaConta?.parcela_numero && (
                <p className="text-xs text-muted-foreground">Parcela {baixaConta.parcela_numero}/{baixaConta.parcela_total}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor Pago (R$)</Label>
                  <Input type="number" step="0.01" value={baixaForm.valor_pago} onChange={e => setBaixaForm(f => ({ ...f, valor_pago: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Forma Pgto</Label>
                  <SelectFormaPgto value={baixaForm.forma_pagamento} onChange={v => setBaixaForm(f => ({ ...f, forma_pagamento: v }))} />
                </div>
                <div className="space-y-2">
                  <Label>Conta Bancária</Label>
                  <SelectContaBancaria value={baixaForm.conta_bancaria_id} onChange={v => setBaixaForm(f => ({ ...f, conta_bancaria_id: v }))} />
                </div>
                <div className="space-y-2">
                  <Label>Juros (R$)</Label>
                  <Input type="number" step="0.01" value={baixaForm.valor_juros} onChange={e => setBaixaForm(f => ({ ...f, valor_juros: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Multa (R$)</Label>
                  <Input type="number" step="0.01" value={baixaForm.valor_multa} onChange={e => setBaixaForm(f => ({ ...f, valor_multa: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Desconto (R$)</Label>
                  <Input type="number" step="0.01" value={baixaForm.valor_desconto} onChange={e => setBaixaForm(f => ({ ...f, valor_desconto: e.target.value }))} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Confirmar Baixa
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : contas.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhuma conta cadastrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Forma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contas.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.descricao}</TableCell>
                      <TableCell>{c.pessoas?.razao_social || "—"}</TableCell>
                      <TableCell>{new Date(c.data_vencimento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{formatCurrency(c.valor_original)}</TableCell>
                      <TableCell>{c.parcela_numero && c.parcela_total ? `${c.parcela_numero}/${c.parcela_total}` : "—"}</TableCell>
                      <TableCell className="capitalize">{c.forma_pagamento || "—"}</TableCell>
                      <TableCell>{statusBadge(c.status)}</TableCell>
                      <TableCell>
                        {c.status === "aberto" && (
                          <Button size="sm" variant="outline" onClick={() => openBaixa(c)}>Dar Baixa</Button>
                        )}
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

export default ContasPagar;
