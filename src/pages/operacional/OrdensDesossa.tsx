import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const emptyForm = {
  data_desossa: new Date().toISOString().slice(0, 10),
  numero_ordem: "",
  ficha_abate_id: "",
  quantidade_meias_carcacas: 0,
  peso_entrada: 0,
  peso_saida_total: 0,
  responsavel: "",
  status: "aberta",
  observacoes: "",
};

export default function OrdensDesossa() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [fichas, setFichas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("ordens_desossa").select("*, fichas_abate(numero_ficha, data_abate)").order("data_desossa", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const fetchFichas = async () => {
    const { data } = await supabase.from("fichas_abate").select("id, numero_ficha, data_abate, quantidade_animais").eq("status", "concluido").order("data_abate", { ascending: false });
    setFichas(data || []);
  };

  useEffect(() => { fetch_(); fetchFichas(); }, []);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm, data_desossa: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      data_desossa: item.data_desossa, numero_ordem: item.numero_ordem || "",
      ficha_abate_id: item.ficha_abate_id || "", quantidade_meias_carcacas: item.quantidade_meias_carcacas,
      peso_entrada: item.peso_entrada || 0, peso_saida_total: item.peso_saida_total || 0,
      responsavel: item.responsavel || "", status: item.status, observacoes: item.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const payload = {
      ...form,
      ficha_abate_id: form.ficha_abate_id || null,
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
    };

    if (editingId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("ordens_desossa").update(upd).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Ordem atualizada!"); setDialogOpen(false); fetch_(); }
    } else {
      const { error } = await supabase.from("ordens_desossa").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Ordem criada!"); setDialogOpen(false); fetch_(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("ordens_desossa").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Registro removido."); fetch_(); }
  };

  const statusColor = (s: string) => s === "finalizada" ? "bg-green-500/10 text-green-400 border-green-500/20" : s === "em_andamento" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-muted text-muted-foreground";

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Ordens de Desossa</h1>
            <p className="text-sm text-muted-foreground">Controle de rendimento e cortes</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nova Ordem</Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/50 bg-card">
            <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nova"} Ordem de Desossa</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Data</Label><Input type="date" value={form.data_desossa} onChange={e => setForm(f => ({ ...f, data_desossa: e.target.value }))} required /></div>
                <div className="space-y-2"><Label>Nº Ordem</Label><Input value={form.numero_ordem} onChange={e => setForm(f => ({ ...f, numero_ordem: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Ficha de Abate</Label>
                  <Select value={form.ficha_abate_id} onValueChange={v => setForm(f => ({ ...f, ficha_abate_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>{fichas.map(f => <SelectItem key={f.id} value={f.id}>Ficha {f.numero_ficha || "s/n"} ({f.quantidade_animais} cab.)</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Qtd. ½ Carcaças</Label><Input type="number" value={form.quantidade_meias_carcacas} onChange={e => setForm(f => ({ ...f, quantidade_meias_carcacas: Number(e.target.value) }))} required /></div>
                <div className="space-y-2"><Label>Peso Entrada</Label><Input type="number" value={form.peso_entrada} onChange={e => setForm(f => ({ ...f, peso_entrada: Number(e.target.value) }))} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberta">Aberta</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar Ordem</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead className="text-right">½ Carcaças</TableHead>
                  <TableHead className="text-right">P. Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma ordem encontrada</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{format(new Date(i.data_desossa + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-mono text-xs">{i.numero_ordem || "-"}</TableCell>
                    <TableCell className="text-right">{i.quantidade_meias_carcacas}</TableCell>
                    <TableCell className="text-right">{Number(i.peso_entrada || 0).toLocaleString()} kg</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(i.status)}>{i.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(i)}><Pencil className="h-4 w-4" /></Button>
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
    </AppLayout>
  );
}
