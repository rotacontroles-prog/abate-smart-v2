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
import { Plus, Loader2, Pencil, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const emptyForm = {
  nome: "", telefone: "", email: "", percentual_comissao: "2.5", pessoa_id: "",
};

const Vendedores = () => {
  const { profile } = useAuth();
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: v }, { data: p }] = await Promise.all([
      supabase.from("vendedores").select("*, pessoas(razao_social)").order("nome"),
      supabase.from("pessoas").select("id, razao_social").order("razao_social"),
    ]);
    setVendedores(v || []);
    setPessoas(p || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openNew = () => { setEditingId(null); setForm({ ...emptyForm }); setDialogOpen(true); };

  const openEdit = (v: any) => {
    setEditingId(v.id);
    setForm({
      nome: v.nome, telefone: v.telefone || "", email: v.email || "",
      percentual_comissao: String(v.percentual_comissao), pessoa_id: v.pessoa_id || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    setSaving(true);

    const payload = {
      nome: form.nome.trim(),
      telefone: form.telefone || null,
      email: form.email || null,
      percentual_comissao: parseFloat(form.percentual_comissao) || 2.5,
      pessoa_id: form.pessoa_id || null,
    };

    if (editingId) {
      const { error } = await supabase.from("vendedores").update(payload).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Vendedor atualizado!"); setDialogOpen(false); fetchAll(); }
    } else {
      const { error } = await supabase.from("vendedores").insert({
        ...payload, tenant_id: profile.tenant_id, empresa_id: profile.empresa_id,
      });
      if (error) toast.error(error.message);
      else { toast.success("Vendedor cadastrado!"); setDialogOpen(false); fetchAll(); }
    }
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading">Vendedores</h1>
            <p className="text-sm text-muted-foreground">Equipe comercial e comissões</p>
          </div>
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Vendedor</Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-heading">{editingId ? "Editar" : "Novo"} Vendedor</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Pessoa vinculada</Label>
                <Select value={form.pessoa_id} onValueChange={v => setForm(f => ({ ...f, pessoa_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="(opcional)" /></SelectTrigger>
                  <SelectContent>
                    {pessoas.map(p => <SelectItem key={p.id} value={p.id}>{p.razao_social}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} maxLength={100} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Comissão (%)</Label>
                <Input type="number" step="0.1" min="0" max="100" value={form.percentual_comissao} onChange={e => setForm(f => ({ ...f, percentual_comissao: e.target.value }))} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingId ? "Atualizar" : "Salvar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : vendedores.length === 0 ? (
              <div className="text-center py-12">
                <UserCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum vendedor cadastrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Pessoa vinculada</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead className="text-right">Comissão %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendedores.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.nome}</TableCell>
                      <TableCell>{v.pessoas?.razao_social || "—"}</TableCell>
                      <TableCell>{v.telefone || "—"}</TableCell>
                      <TableCell>{v.email || "—"}</TableCell>
                      <TableCell className="text-right">{v.percentual_comissao}%</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={v.ativo ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                          {v.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
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

export default Vendedores;
