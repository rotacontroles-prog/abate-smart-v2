import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const emptyForm = {
  data_abate: new Date().toISOString().slice(0, 10),
  quantidade_animais: 0,
  peso_total_vivo: 0,
  status: "aberto",
  custo_total_animais: 0,
  custo_indireto_rateado: 0,
};

export default function LotesAbate() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("lotes_abate").select("*").order("data_abate", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm, data_abate: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      data_abate: item.data_abate,
      quantidade_animais: item.quantidade_animais,
      peso_total_vivo: item.peso_total_vivo || 0,
      status: item.status,
      custo_total_animais: item.custo_total_animais || 0,
      custo_indireto_rateado: item.custo_indireto_rateado || 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const payload = {
      ...form,
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
    };

    if (editingId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("lotes_abate").update(upd).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Lote atualizado!"); setDialogOpen(false); fetch_(); }
    } else {
      const { error } = await supabase.from("lotes_abate").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Lote criado!"); setDialogOpen(false); fetch_(); }
    }
    setSaving(false);
  };

  const finalizeLote = async (id: string) => {
    const { error } = await supabase.rpc("finalizar_lote_abate", { p_lote_id: id });
    if (error) toast.error(error.message);
    else { toast.success("Lote finalizado!"); fetch_(); }
  };

  const statusColor = (s: string) => s === "finalizado" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-muted text-muted-foreground";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Lotes de Abate</h1>
            <p className="text-sm text-muted-foreground">Agrupamento diário para custos e rendimentos</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Novo Lote</Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Animais</TableHead>
                  <TableHead className="text-right">Peso Total</TableHead>
                  <TableHead className="text-right">Custo Animais</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum lote registrado</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{format(new Date(i.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">{i.quantidade_animais}</TableCell>
                    <TableCell className="text-right">{Number(i.peso_total_vivo || 0).toLocaleString()} kg</TableCell>
                    <TableCell className="text-right">{Number(i.custo_total_animais || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(i.status)}>{i.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(i)} disabled={i.status === "finalizado"}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-400" onClick={() => finalizeLote(i.id)} disabled={i.status === "finalizado"}><CheckCircle2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="max-w-lg border-border/50 bg-card">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Novo"} Lote de Abate</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Data do Abate</Label><Input type="date" value={form.data_abate} onChange={e => setForm(f => ({ ...f, data_abate: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>Quantidade Animais</Label><Input type="number" value={form.quantidade_animais} onChange={e => setForm(f => ({ ...f, quantidade_animais: Number(e.target.value) }))} required /></div>
              <div className="space-y-2"><Label>Peso Total Vivo (kg)</Label><Input type="number" value={form.peso_total_vivo} onChange={e => setForm(f => ({ ...f, peso_total_vivo: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_processamento">Em Processamento</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Custo Total Animais</Label><Input type="number" value={form.custo_total_animais} onChange={e => setForm(f => ({ ...f, custo_total_animais: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Custo Indireto</Label><Input type="number" value={form.custo_indireto_rateado} onChange={e => setForm(f => ({ ...f, custo_indireto_rateado: Number(e.target.value) }))} /></div>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar Lote</Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
