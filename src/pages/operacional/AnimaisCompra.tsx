import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ARROBA_KG = 15;

const emptyForm = {
  data_compra: new Date().toISOString().slice(0, 10),
  numero_gta: "",
  quantidade: 0,
  peso_total: 0,
  valor_unitario: 0,
  valor_total: 0,
  especie: "bovino",
  raca: "",
  sexo: "",
  observacoes: "",
  status: "pendente",
  pessoa_id: "",
  preco_arroba: 0,
  peso_arroba: 0,
  categoria_peso: "medio",
  funrural_percentual: 1.5,
  funrural_valor: 0,
  senar_percentual: 0.2,
  senar_valor: 0,
  gta_valor: 0,
  total_impostos: 0,
  comissao_comprador_percentual: 1.5,
  comissao_comprador_valor: 0,
  comprador_nome: "",
  valor_liquido: 0,
};

const emptyRomaneio = {
  data_embarque: new Date().toISOString().slice(0, 10),
  veiculo_placa: "",
  veiculo_tipo: "",
  motorista_nome: "",
  motorista_cpf: "",
  km_inicial: 0,
  km_final: 0,
  valor_frete_km: 0,
  valor_frete_total: 0,
  peso_embarque: 0,
  quantidade_animais: 0,
  origem_fazenda: "",
  origem_cidade: "",
  origem_uf: "",
  destino_unidade: "",
  observacoes: "",
  status: "pendente",
};

export default function AnimaisCompra() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [romaneioDialogOpen, setRomaneioDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [romaneioForm, setRomaneioForm] = useState({ ...emptyRomaneio });
  const [selectedCompraId, setSelectedCompraId] = useState<string | null>(null);
  const [romaneios, setRomaneios] = useState<any[]>([]);
  const [romaneioEditId, setRomaneioEditId] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("animais_compra")
      .select("*, pessoas(razao_social)")
      .order("data_compra", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const fetchPessoas = async () => {
    const { data } = await supabase.from("pessoas").select("id, razao_social").contains("tipo", ["fornecedor"]).order("razao_social");
    setPessoas(data || []);
  };

  const fetchRomaneios = async (compraId: string) => {
    const { data } = await supabase
      .from("romaneios_embarque")
      .select("*")
      .eq("compra_id", compraId)
      .order("created_at", { ascending: false });
    setRomaneios(data || []);
  };

  const handleRomaneioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id || !selectedCompraId) { toast.error("Dados incompletos."); return; }
    setSaving(true);
    const payload = {
      ...romaneioForm,
      compra_id: selectedCompraId,
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
    };

    if (romaneioEditId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("romaneios_embarque").update(upd).eq("id", romaneioEditId);
      if (error) toast.error(error.message);
      else { toast.success("Romaneio atualizado!"); fetchRomaneios(selectedCompraId); setRomaneioEditId(null); }
    } else {
      const { error } = await supabase.from("romaneios_embarque").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Romaneio registrado!"); fetchRomaneios(selectedCompraId); setRomaneioEditId(null); }
    }
    setSaving(false);
  };

  const deleteRomaneio = async (id: string) => {
    const { error } = await supabase.from("romaneios_embarque").delete().eq("id", id);
    if (error) toast.error(error.message);
    else if (selectedCompraId) { toast.success("Romaneio excluído."); fetchRomaneios(selectedCompraId); }
  };

  useEffect(() => { fetch_(); fetchPessoas(); }, []);

  const calcArrobas = useCallback((pesoTotal: number, qtd: number) => {
    if (qtd <= 0) return 0;
    return Number(((pesoTotal / qtd) / ARROBA_KG).toFixed(2));
  }, []);

  const categoriaPeso = (arrobas: number) => {
    if (arrobas < 18) return "leve";
    if (arrobas <= 21) return "medio";
    return "pesado";
  };

  const recalcTaxes = (f: typeof emptyForm) => {
    const vt = f.valor_total;
    const funrural = Number((vt * f.funrural_percentual / 100).toFixed(2));
    const senar = Number((vt * f.senar_percentual / 100).toFixed(2));
    const totalImp = funrural + senar + f.gta_valor;
    const comissao = Number((vt * f.comissao_comprador_percentual / 100).toFixed(2));
    const arrobas = calcArrobas(f.peso_total, f.quantidade);
    const cat = categoriaPeso(arrobas);
    const valorLiquido = Number((vt - totalImp).toFixed(2));
    return {
      ...f,
      funrural_valor: funrural,
      senar_valor: senar,
      total_impostos: totalImp,
      comissao_comprador_valor: comissao,
      peso_arroba: arrobas,
      categoria_peso: cat,
      valor_liquido: valorLiquido,
    };
  };

  const updateForm = (patch: Partial<typeof emptyForm>) => {
    setForm(prev => {
      const next = { ...prev, ...patch };
      if (patch.preco_arroba !== undefined || patch.peso_total !== undefined || patch.quantidade !== undefined) {
        const arrobas = calcArrobas(next.peso_total, next.quantidade);
        if (next.preco_arroba > 0 && arrobas > 0) {
          next.valor_total = Number((next.preco_arroba * arrobas * next.quantidade).toFixed(2));
          next.valor_unitario = next.quantidade > 0 ? Number((next.valor_total / next.quantidade).toFixed(2)) : 0;
        }
      }
      return recalcTaxes(next);
    });
  };

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm, data_compra: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const payload = {
      ...form,
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
      pessoa_id: form.pessoa_id || null,
    };

    if (editingId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("animais_compra").update(upd).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Compra atualizada!"); setDialogOpen(false); fetch_(); }
    } else {
      const { error } = await supabase.from("animais_compra").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Compra registrada!"); setDialogOpen(false); fetch_(); }
    }
    setSaving(false);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      data_compra: item.data_compra,
      numero_gta: item.numero_gta || "",
      quantidade: item.quantidade,
      peso_total: item.peso_total || 0,
      valor_unitario: item.valor_unitario || 0,
      valor_total: item.valor_total || 0,
      especie: item.especie || "bovino",
      raca: item.raca || "",
      sexo: item.sexo || "",
      observacoes: item.observacoes || "",
      status: item.status,
      pessoa_id: item.pessoa_id || "",
      preco_arroba: item.preco_arroba || 0,
      peso_arroba: item.peso_arroba || 0,
      categoria_peso: item.categoria_peso || "medio",
      funrural_percentual: item.funrural_percentual || 1.5,
      funrural_valor: item.funrural_valor || 0,
      senar_percentual: item.senar_percentual || 0.2,
      senar_valor: item.senar_valor || 0,
      gta_valor: item.gta_valor || 0,
      total_impostos: item.total_impostos || 0,
      comissao_comprador_percentual: item.comissao_comprador_percentual || 1.5,
      comissao_comprador_valor: item.comissao_comprador_valor || 0,
      comprador_nome: item.comprador_nome || "",
      valor_liquido: item.valor_liquido || 0,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("animais_compra").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Registro removido."); fetch_(); }
  };

  const statusColor = (s: string) => s === "recebido" ? "border-green-500/20 text-emerald-500 bg-emerald-500/10" : s === "em_transito" ? "border-amber-500/20 text-amber-500 bg-amber-500/10" : "bg-muted text-muted-foreground";
  const catColor = (c: string) => c === "leve" ? "border-blue-500/20 text-blue-500 bg-blue-500/10" : c === "pesado" ? "border-rose-500/20 text-rose-500 bg-rose-500/10" : "border-amber-500/20 text-amber-500 bg-amber-500/10";
  const fmt = (v: number) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Compra de Animais</h1>
            <p className="text-sm text-muted-foreground">Controle de aquisição e romaneios de embarque</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Nova Compra</Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>GTA</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhuma compra registrada</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{format(new Date(i.data_compra + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-mono text-xs">{i.numero_gta || "-"}</TableCell>
                    <TableCell>{i.pessoas?.razao_social || "-"}</TableCell>
                    <TableCell className="text-right">{i.quantidade}</TableCell>
                    <TableCell className="text-right">{(i.peso_total || 0).toLocaleString()} kg</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(i.valor_total)}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(i.status)}>{i.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(i)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedCompraId(i.id); setRomaneioDialogOpen(true); fetchRomaneios(i.id); }}><Truck className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nova"} Compra de Animais</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Tabs defaultValue="geral">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="geral">Geral</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="fiscal">Fiscal</TabsTrigger>
              </TabsList>
              <TabsContent value="geral" className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2"><Label>Data</Label><Input type="date" value={form.data_compra} onChange={e => updateForm({ data_compra: e.target.value })} required /></div>
                <div className="space-y-2"><Label>GTA</Label><Input value={form.numero_gta} onChange={e => updateForm({ numero_gta: e.target.value })} /></div>
                <div className="space-y-2"><Label>Fornecedor</Label>
                  <Select value={form.pessoa_id} onValueChange={v => updateForm({ pessoa_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{pessoas.map(p => <SelectItem key={p.id} value={p.id}>{p.razao_social}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Quantidade</Label><Input type="number" value={form.quantidade} onChange={e => updateForm({ quantidade: Number(e.target.value) })} required /></div>
                <div className="space-y-2 col-span-2"><Label>Observacoes</Label><Textarea value={form.observacoes} onChange={e => updateForm({ observacoes: e.target.value })} /></div>
              </TabsContent>
              <TabsContent value="financeiro" className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2"><Label>Peso Total (kg)</Label><Input type="number" min={0} step="0.01" value={form.peso_total} onChange={e => updateForm({ peso_total: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Preco por @ (R$)</Label><Input type="number" min={0} step="0.01" value={form.preco_arroba} onChange={e => updateForm({ preco_arroba: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Peso @ Médio</Label><Badge variant="outline" className={cn("ml-2 px-6", catColor(form.categoria_peso))}>{form.peso_arroba} @</Badge></div>
                <div className="space-y-2"><Label>Total Bruto</Label><Input value={fmt(form.valor_total)} disabled className="bg-muted font-bold" /></div>
                <div className="space-y-2"><Label>Total Líquido</Label><Input value={fmt(form.valor_liquido)} disabled className="bg-muted text-emerald-500 font-bold" /></div>
              </TabsContent>
              <TabsContent value="fiscal" className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2"><Label>Funrural (%)</Label><Input type="number" value={form.funrural_percentual} onChange={e => updateForm({ funrural_percentual: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Funrural (R$)</Label><Input value={fmt(form.funrural_valor)} disabled className="bg-muted" /></div>
                <div className="space-y-2"><Label>Senar (%)</Label><Input type="number" value={form.senar_percentual} onChange={e => updateForm({ senar_percentual: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Senar (R$)</Label><Input value={fmt(form.senar_valor)} disabled className="bg-muted" /></div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="w-full mt-4" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar Compra</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={romaneioDialogOpen} onOpenChange={setRomaneioDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-border/50 bg-card">
          <DialogHeader><DialogTitle>Romaneios de Embarque</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <form onSubmit={handleRomaneioSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-4 rounded-lg border border-border/50">
              <div className="space-y-1"><Label className="text-xs">Data</Label><Input type="date" value={romaneioForm.data_embarque} onChange={e => setRomaneioForm(f => ({ ...f, data_embarque: e.target.value }))} className="h-8 text-xs" required /></div>
              <div className="space-y-1"><Label className="text-xs">Placa</Label><Input value={romaneioForm.veiculo_placa} onChange={e => setRomaneioForm(f => ({ ...f, veiculo_placa: e.target.value }))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Qtd</Label><Input type="number" value={romaneioForm.quantidade_animais} onChange={e => setRomaneioForm(f => ({ ...f, quantidade_animais: Number(e.target.value) }))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Peso (kg)</Label><Input type="number" value={romaneioForm.peso_embarque} onChange={e => setRomaneioForm(f => ({ ...f, peso_embarque: Number(e.target.value) }))} className="h-8 text-xs" /></div>
              <div className="col-span-2 md:col-span-3 space-y-1"><Label className="text-xs">Motorista</Label><Input value={romaneioForm.motorista_nome} onChange={e => setRomaneioForm(f => ({ ...f, motorista_nome: e.target.value }))} className="h-8 text-xs" /></div>
              <div className="flex items-end"><Button type="submit" size="sm" className="w-full h-8" disabled={saving}>{romaneioEditId ? "Atualizar" : "Adicionar"}</Button></div>
            </form>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Peso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {romaneios.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-4 text-muted-foreground">Nenhum romaneio</TableCell></TableRow> : romaneios.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{format(new Date(r.data_embarque + "T12:00:00"), "dd/MM")}</TableCell>
                    <TableCell className="uppercase">{r.veiculo_placa || "—"}</TableCell>
                    <TableCell>{r.motorista_nome || "—"}</TableCell>
                    <TableCell className="text-right">{r.quantidade_animais}</TableCell>
                    <TableCell className="text-right">{r.peso_embarque?.toLocaleString()} kg</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setRomaneioEditId(r.id); setRomaneioForm({ ...r }); }}><Pencil className="h-3 w-3" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteRomaneio(r.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
