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
import { toast } from "sonner";
import { Plus, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Conta {
  id: string;
  codigo: string;
  descricao: string;
  tipo: string;
  natureza: string;
  conta_pai_id: string | null;
  sintetica: boolean;
}

const PlanoContas = () => {
  const { profile } = useAuth();
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    tipo: "ativo",
    natureza: "devedora",
    conta_pai_id: "",
    sintetica: false,
  });

  const fetchContas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plano_contas")
      .select("id, codigo, descricao, tipo, natureza, conta_pai_id, sintetica")
      .order("codigo");
    if (error) toast.error(error.message);
    else setContas((data as Conta[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchContas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) {
      toast.error("Perfil incompleto.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("plano_contas").insert({
      tenant_id: profile.tenant_id,
      empresa_id: profile.empresa_id,
      codigo: form.codigo,
      descricao: form.descricao,
      tipo: form.tipo,
      natureza: form.natureza,
      conta_pai_id: form.conta_pai_id || null,
      sintetica: form.sintetica,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Conta criada!");
      setDialogOpen(false);
      setForm({ codigo: "", descricao: "", tipo: "ativo", natureza: "devedora", conta_pai_id: "", sintetica: false });
      fetchContas();
    }
    setSaving(false);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const rootContas = contas.filter(c => !c.conta_pai_id);
  const getChildren = (parentId: string) => contas.filter(c => c.conta_pai_id === parentId);

  const renderRow = (conta: Conta, level: number = 0): React.ReactNode => {
    const children = getChildren(conta.id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(conta.id);

    return (
      <React.Fragment key={conta.id}>
        <TableRow className={conta.sintetica ? "font-medium" : ""}>
          <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button onClick={() => toggleExpand(conta.id)} className="text-muted-foreground hover:text-foreground">
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                </button>
              )}
              <span className="font-mono text-xs text-muted-foreground">{conta.codigo}</span>
              <span>{conta.descricao}</span>
            </div>
          </TableCell>
          <TableCell className="capitalize text-sm">{conta.tipo.replace("_", " ")}</TableCell>
          <TableCell className="capitalize text-sm">{conta.natureza}</TableCell>
          <TableCell className="text-sm">{conta.sintetica ? "Sintética" : "Analítica"}</TableCell>
        </TableRow>
        {isExpanded && children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  const sinteticas = contas.filter(c => c.sintetica);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading">Plano de Contas</h1>
            <p className="text-sm text-muted-foreground">Estrutura contábil hierárquica</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Nova Conta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading">Nova Conta Contábil</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Código</Label>
                    <Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} placeholder="1.1.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="passivo">Passivo</SelectItem>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                        <SelectItem value="patrimonio_liquido">Patrimônio Líquido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Natureza</Label>
                    <Select value={form.natureza} onValueChange={v => setForm(f => ({ ...f, natureza: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="devedora">Devedora</SelectItem>
                        <SelectItem value="credora">Credora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Conta Pai</Label>
                    <Select value={form.conta_pai_id} onValueChange={v => setForm(f => ({ ...f, conta_pai_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Nenhuma (raiz)" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhuma (raiz)</SelectItem>
                        {sinteticas.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.codigo} - {c.descricao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sintetica" checked={form.sintetica} onChange={e => setForm(f => ({ ...f, sintetica: e.target.checked }))} />
                  <Label htmlFor="sintetica">Conta Sintética (agrupadora)</Label>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Salvar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : contas.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhuma conta cadastrada no plano de contas</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Natureza</TableHead>
                    <TableHead>Classificação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootContas.map(conta => renderRow(conta))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

import React from "react";
export default PlanoContas;
