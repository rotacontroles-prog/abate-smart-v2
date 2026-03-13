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
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const emptyForm = {
  data_abate: new Date().toISOString().slice(0, 10),
  numero_ficha: "",
  compra_id: "",
  quantidade_animais: 0,
  peso_vivo: 0,
  peso_carcaca: 0,
  sif_responsavel: "",
  veterinario: "",
  status: "pendente",
};

export default function FichasAbate() {
  const { profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("fichas_abate").select("*, animais_compra(numero_gta)").order("data_abate", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  const fetchCompras = async () => {
    const { data } = await supabase.from("animais_compra").select("id, numero_gta").eq("status", "ativo");
    setCompras(data || []);
  };

  useEffect(() => { fetch_(); fetchCompras(); }, []);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm, data_abate: new Date().toISOString().slice(0, 10) }); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);
    const payload = { ...form, tenant_id: profile.tenant_id, empresa_id: profile.empresa_id };

    if (editingId) {
      const { tenant_id, empresa_id, ...upd } = payload;
      const { error } = await supabase.from("fichas_abate").update(upd).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Ficha atualizada!"); setDialogOpen(false); fetch_(); }
    } else {
      const { error } = await supabase.from("fichas_abate").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Ficha criada!"); setDialogOpen(false); fetch_(); }
    }
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Fichas de Abate</h1>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Nova Ficha</Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ficha</TableHead>
                  <TableHead>GTA</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Peso Vivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhuma ficha registrada</TableCell></TableRow> : items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{format(new Date(item.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-medium">{item.numero_ficha}</TableCell>
                    <TableCell>{item.animais_compra?.numero_gta || "-"}</TableCell>
                    <TableCell className="text-right">{item.quantidade_animais}</TableCell>
                    <TableCell className="text-right">{item.peso_vivo.toLocaleString("pt-BR")} kg</TableCell>
                    <TableCell><Badge variant={item.status === 'concluido' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingId ? "Editar" : "Nova"} Ficha de Abate</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Data Abate</Label>
              <Input type="date" value={form.data_abate} onChange={e => setForm(f => ({ ...f, data_abate: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Numero Ficha</Label>
              <Input value={form.numero_ficha} onChange={e => setForm(f => ({ ...f, numero_ficha: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Compra (GTA)</Label>
              <Select value={form.compra_id} onValueChange={v => setForm(f => ({ ...f, compra_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione a compra" /></SelectTrigger>
                <SelectContent>{compras.map(c => <SelectItem key={c.id} value={c.id}>GTA {c.numero_gta}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input type="number" value={form.quantidade_animais} onChange={e => setForm(f => ({ ...f, quantidade_animais: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-2">
              <Label>Peso Vivo Total</Label>
              <Input type="number" value={form.peso_vivo} onChange={e => setForm(f => ({ ...f, peso_vivo: Number(e.target.value) }))} required />
            </div>
            <div className="space-y-2">
              <Label>SIF Responsavel</Label>
              <Input value={form.sif_responsavel} onChange={e => setForm(f => ({ ...f, sif_responsavel: e.target.value }))} />
            </div>
            <Button type="submit" className="col-span-2 mt-4" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Salvar Ficha</Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
