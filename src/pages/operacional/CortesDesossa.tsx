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
import { toast } from "sonner";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const emptyForm = {
  ordem_desossa_id: "",
  nome_corte: "",
  quantidade: 0,
  peso: 0,
  destino: "estoque",
  observacoes: "",
};

export default function CortesDesossa() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [ordens, setOrdens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cortes_desossa").select("*, ordens_desossa(numero_ordem, data_desossa)").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const fetchOrdens = async () => {
    const { data } = await supabase.from("ordens_desossa").select("id, numero_ordem, data_desossa").order("data_desossa", { ascending: false });
    setOrdens(data || []);
  };

  useEffect(() => { fetch_(); fetchOrdens(); }, []);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm }); setDialogOpen(true); };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      ordem_desossa_id: item.ordem_desossa_id, nome_corte: item.nome_corte,
      quantidade: item.quantidade, peso: item.peso, destino: item.destino || "estoque",
      observacoes: item.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    if (!form.ordem_desossa_id) { toast.error("Selecione uma ordem de desossa."); return; }
    setSaving(true);
    const payload = {
      ...form,
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
    };

    if (editingId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("cortes_desossa").update(upd).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Corte atualizado!"); setDialogOpen(false); fetch_(); }
    } else {
      const { error } = await supabase.from("cortes_desossa").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Corte registrado!"); setDialogOpen(false); fetch_(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cortes_desossa").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Registro removido."); fetch_(); }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Cortes de Desossa</h1>
            <p className="text-sm text-muted-foreground">Registro dos cortes produzidos</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Corte</Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-border/50 bg-card">
            <DialogHeader><DialogTitle>{editingId ? "Editar" : "Novo"} Corte</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Ordem de Desossa</Label>
                <Select value={form.ordem_desossa_id} onValueChange={v => setForm(f => ({ ...f, ordem_desossa_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{ordens.map(o => <SelectItem key={o.id} value={o.id}>Ordem {o.numero_ordem || "s/n"} - {format(new Date(o.data_desossa + "T12:00:00"), "dd/MM/yyyy")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome do Corte</Label><Input value={form.nome_corte} onChange={e => setForm(f => ({ ...f, nome_corte: e.target.value }))} required /></div>
                <div className="space-y-2"><Label>Destino</Label>
                  <Select value={form.destino} onValueChange={v => setForm(f => ({ ...f, destino: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estoque">Estoque</SelectItem>
                      <SelectItem value="venda_direta">Venda Direta</SelectItem>
                      <SelectItem value="industrializacao">Industrialização</SelectItem>
                      <SelectItem value="descarte">Descarte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Quantidade</Label><Input type="number" value={form.quantidade} onChange={e => setForm(f => ({ ...f, quantidade: Number(e.target.value) }))} required /></div>
                <div className="space-y-2"><Label>Peso (kg)</Label><Input type="number" value={form.peso} onChange={e => setForm(f => ({ ...f, peso: Number(e.target.value) }))} required /></div>
              </div>
              <div className="space-y-2"><Label>Observações</Label><Textarea value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar Corte</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Corte</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum corte registrado</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="text-xs">{i.ordens_desossa?.numero_ordem || "—"} - {i.ordens_desossa?.data_desossa ? format(new Date(i.ordens_desossa.data_desossa + "T12:00:00"), "dd/MM") : ""}</TableCell>
                    <TableCell className="font-medium">{i.nome_corte}</TableCell>
                    <TableCell className="text-right">{Number(i.quantidade).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{Number(i.peso).toLocaleString()} kg</TableCell>
                    <TableCell className="capitalize">{(i.destino || "estoque").replace("_", " ")}</TableCell>
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
