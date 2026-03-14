import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, Loader2, Eye, Truck, CheckCircle, XCircle, PackageCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-muted text-muted-foreground" },
  confirmado: { label: "Confirmado", cls: "bg-primary/10 text-primary border-primary/20" },
  em_separacao: { label: "Em Separação", cls: "bg-warning/10 text-warning border-warning/20" },
  expedido: { label: "Expedido", cls: "bg-accent/10 text-accent border-accent/20" },
  entregue: { label: "Entregue", cls: "bg-success/10 text-success border-success/20" },
  cancelado: { label: "Cancelado", cls: "bg-destructive/10 text-destructive border-destructive/20" },
};

const CONDICOES = [
  { value: "a_vista", label: "À Vista" },
  { value: "7_dias", label: "7 dias" },
  { value: "14_dias", label: "14 dias" },
  { value: "21_dias", label: "21 dias" },
  { value: "28_dias", label: "28 dias" },
  { value: "30_dias", label: "30 dias" },
  { value: "30_60", label: "30/60 dias" },
  { value: "30_60_90", label: "30/60/90 dias" },
];

type ItemForm = { produto_id: string; quantidade: string; preco_unitario: string };

const PedidosVenda = () => {
  const { profile } = useAuth();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [romaneioOpen, setRomaneioOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);
  const [pedidoItens, setPedidoItens] = useState<any[]>([]);

  // Form state
  const [form, setForm] = useState({
    cliente_id: "", vendedor_id: "", data_entrega_prevista: "",
    condicao_pagamento: "a_vista", valor_desconto: "0", valor_frete: "0", observacoes: "",
  });
  const [itens, setItens] = useState<ItemForm[]>([]);

  // Romaneio form
  const [romForm, setRomForm] = useState({
    veiculo_placa: "", motorista_nome: "", motorista_cpf: "", valor_frete: "0", peso_total: "0", observacoes: "",
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: p }, { data: c }, { data: v }, { data: pr }] = await Promise.all([
      supabase.from("pedidos_venda").select("*, pessoas:cliente_id(razao_social), vendedores:vendedor_id(nome)").order("created_at", { ascending: false }),
      supabase.from("pessoas").select("id, razao_social").contains("tipo", ["cliente"]).order("razao_social"),
      supabase.from("vendedores").select("id, nome, percentual_comissao").eq("ativo", true).order("nome"),
      supabase.from("produtos").select("id, codigo, descricao, preco_venda, estoque_atual, unidade").eq("ativo", true).order("codigo"),
    ]);
    setPedidos(p || []);
    setClientes(c || []);
    setVendedores(v || []);
    setProdutos(pr || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const resetForm = () => {
    setForm({ cliente_id: "", vendedor_id: "", data_entrega_prevista: "", condicao_pagamento: "a_vista", valor_desconto: "0", valor_frete: "0", observacoes: "" });
    setItens([]);
  };

  const addItem = () => setItens(prev => [...prev, { produto_id: "", quantidade: "", preco_unitario: "" }]);

  const removeItem = (idx: number) => setItens(prev => prev.filter((_, i) => i !== idx));

  const updateItem = (idx: number, field: keyof ItemForm, value: string) => {
    setItens(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const selectProduct = (idx: number, prodId: string) => {
    const prod = produtos.find(p => p.id === prodId);
    setItens(prev => prev.map((item, i) => i === idx ? {
      ...item, produto_id: prodId, preco_unitario: prod ? String(prod.preco_venda) : item.preco_unitario,
    } : item));
  };

  const calcTotal = () => {
    const valorProdutos = itens.reduce((sum, it) => {
      const q = parseFloat(it.quantidade) || 0;
      const p = parseFloat(it.preco_unitario) || 0;
      return sum + q * p;
    }, 0);
    const desc = parseFloat(form.valor_desconto) || 0;
    const frete = parseFloat(form.valor_frete) || 0;
    return { valorProdutos, total: valorProdutos - desc + frete };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id) { toast.error("Perfil incompleto."); return; }
    if (itens.length === 0) { toast.error("Adicione pelo menos um item."); return; }
    const invalid = itens.some(it => !it.produto_id || !it.quantidade || parseFloat(it.quantidade) <= 0);
    if (invalid) { toast.error("Preencha todos os itens corretamente."); return; }

    setSaving(true);
    const { valorProdutos, total } = calcTotal();

    const { data: pedido, error } = await supabase.from("pedidos_venda").insert({
      tenant_id: profile.tenant_id, empresa_id: profile.empresa_id,
      cliente_id: form.cliente_id || null, vendedor_id: form.vendedor_id || null,
      data_entrega_prevista: form.data_entrega_prevista || null,
      condicao_pagamento: form.condicao_pagamento,
      valor_produtos: valorProdutos, valor_desconto: parseFloat(form.valor_desconto) || 0,
      valor_frete: parseFloat(form.valor_frete) || 0, valor_total: total,
      observacoes: form.observacoes || null,
    }).select("id").single();

    if (error) { toast.error(error.message); setSaving(false); return; }

    const itensPayload = itens.map(it => ({
      tenant_id: profile.tenant_id!, pedido_id: pedido.id,
      produto_id: it.produto_id, quantidade: parseFloat(it.quantidade),
      preco_unitario: parseFloat(it.preco_unitario) || 0,
      valor_total: (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0),
    }));

    const { error: itemError } = await supabase.from("itens_pedido").insert(itensPayload);
    if (itemError) { toast.error("Pedido criado, mas erro nos itens: " + itemError.message); }
    else { toast.success("Pedido criado com sucesso!"); }

    setDialogOpen(false);
    resetForm();
    fetchAll();
    setSaving(false);
  };

  const openDetail = async (pedido: any) => {
    setSelectedPedido(pedido);
    const { data } = await supabase.from("itens_pedido")
      .select("*, produtos(codigo, descricao, unidade)")
      .eq("pedido_id", pedido.id);
    setPedidoItens(data || []);
    setDetailOpen(true);
  };

  const changeStatus = async (pedidoId: string, newStatus: string) => {
    setSaving(true);
    const { error } = await supabase.from("pedidos_venda").update({ status: newStatus }).eq("id", pedidoId);
    if (error) toast.error(error.message);
    else {
      const msgs: Record<string, string> = {
        confirmado: "Pedido confirmado! CR gerado automaticamente.",
        em_separacao: "Pedido em separação.",
        expedido: "Pedido expedido! Estoque baixado automaticamente.",
        entregue: "Pedido entregue!",
        cancelado: "Pedido cancelado.",
      };
      toast.success(msgs[newStatus] || "Status atualizado!");
      setDetailOpen(false);
      fetchAll();
    }
    setSaving(false);
  };

  const openRomaneio = (pedido: any) => {
    setSelectedPedido(pedido);
    setRomForm({ veiculo_placa: "", motorista_nome: "", motorista_cpf: "", valor_frete: "0", peso_total: "0", observacoes: "" });
    setRomaneioOpen(true);
  };

  const handleRomaneio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenant_id || !profile?.empresa_id || !selectedPedido) return;
    setSaving(true);
    const { error } = await supabase.from("romaneios_venda").insert({
      tenant_id: profile.tenant_id, empresa_id: profile.empresa_id,
      pedido_id: selectedPedido.id,
      veiculo_placa: romForm.veiculo_placa || null,
      motorista_nome: romForm.motorista_nome || null,
      motorista_cpf: romForm.motorista_cpf || null,
      valor_frete: parseFloat(romForm.valor_frete) || 0,
      peso_total: parseFloat(romForm.peso_total) || 0,
      observacoes: romForm.observacoes || null,
      status: "carregado",
    });
    if (error) toast.error(error.message);
    else { toast.success("Romaneio criado!"); setRomaneioOpen(false); }
    setSaving(false);
  };

  const { total } = calcTotal();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading">Pedidos de Venda</h1>
            <p className="text-sm text-muted-foreground">Gestão comercial B2B</p>
          </div>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Novo Pedido</Button>
        </div>

        {/* ===== NOVO PEDIDO ===== */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">Novo Pedido de Venda</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={form.cliente_id} onValueChange={v => setForm(f => ({ ...f, cliente_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>{clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.razao_social}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendedor</Label>
                  <Select value={form.vendedor_id} onValueChange={v => setForm(f => ({ ...f, vendedor_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>{vendedores.map(v => <SelectItem key={v.id} value={v.id}>{v.nome} ({v.percentual_comissao}%)</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Entrega prevista</Label>
                  <Input type="date" value={form.data_entrega_prevista} onChange={e => setForm(f => ({ ...f, data_entrega_prevista: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Condição de Pagamento</Label>
                  <Select value={form.condicao_pagamento} onValueChange={v => setForm(f => ({ ...f, condicao_pagamento: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CONDICOES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Itens */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-heading">Itens do Pedido</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Adicionar Item</Button>
                </div>
                {itens.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum item adicionado</p>}
                {itens.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5 space-y-1">
                      {idx === 0 && <Label className="text-xs">Produto</Label>}
                      <Select value={item.produto_id} onValueChange={v => selectProduct(idx, v)}>
                        <SelectTrigger><SelectValue placeholder="Produto..." /></SelectTrigger>
                        <SelectContent>{produtos.map(p => <SelectItem key={p.id} value={p.id}>{p.codigo} - {p.descricao} (est: {p.estoque_atual})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-1">
                      {idx === 0 && <Label className="text-xs">Qtd (kg)</Label>}
                      <Input type="number" step="0.01" placeholder="0" value={item.quantidade} onChange={e => updateItem(idx, "quantidade", e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-1">
                      {idx === 0 && <Label className="text-xs">Preço (R$)</Label>}
                      <Input type="number" step="0.01" placeholder="0" value={item.preco_unitario} onChange={e => updateItem(idx, "preco_unitario", e.target.value)} />
                    </div>
                    <div className="col-span-2 text-right">
                      {idx === 0 && <Label className="text-xs block">&nbsp;</Label>}
                      <span className="text-sm font-medium">{fmt((parseFloat(item.quantidade) || 0) * (parseFloat(item.preco_unitario) || 0))}</span>
                    </div>
                    <div className="col-span-1">
                      {idx === 0 && <Label className="text-xs block">&nbsp;</Label>}
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Desconto (R$)</Label>
                  <Input type="number" step="0.01" value={form.valor_desconto} onChange={e => setForm(f => ({ ...f, valor_desconto: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Frete (R$)</Label>
                  <Input type="number" step="0.01" value={form.valor_frete} onChange={e => setForm(f => ({ ...f, valor_frete: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Total do Pedido</Label>
                  <div className="h-10 flex items-center px-3 rounded-md bg-muted font-heading text-lg">{fmt(total)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} rows={2} maxLength={500} />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Salvar Pedido (Rascunho)
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ===== DETALHE PEDIDO ===== */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedPedido && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-heading">Pedido #{selectedPedido.numero_pedido}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Cliente:</span> <strong>{selectedPedido.pessoas?.razao_social || "—"}</strong></div>
                    <div><span className="text-muted-foreground">Vendedor:</span> <strong>{selectedPedido.vendedores?.nome || "—"}</strong></div>
                    <div><span className="text-muted-foreground">Data:</span> {new Date(selectedPedido.data_pedido).toLocaleDateString("pt-BR")}</div>
                    <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={STATUS_MAP[selectedPedido.status]?.cls}>{STATUS_MAP[selectedPedido.status]?.label}</Badge></div>
                    <div><span className="text-muted-foreground">Total:</span> <strong className="text-lg">{fmt(selectedPedido.valor_total)}</strong></div>
                    <div><span className="text-muted-foreground">Condição:</span> {CONDICOES.find(c => c.value === selectedPedido.condicao_pagamento)?.label || selectedPedido.condicao_pagamento}</div>
                  </div>

                  <Separator />

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidoItens.map(it => (
                        <TableRow key={it.id}>
                          <TableCell>{it.produtos?.codigo} - {it.produtos?.descricao}</TableCell>
                          <TableCell className="text-right">{it.quantidade} {it.produtos?.unidade}</TableCell>
                          <TableCell className="text-right">{fmt(it.preco_unitario)}</TableCell>
                          <TableCell className="text-right font-medium">{fmt(it.valor_total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Separator />

                  {/* Ações de status */}
                  <div className="flex flex-wrap gap-2">
                    {selectedPedido.status === "rascunho" && (
                      <>
                        <Button onClick={() => changeStatus(selectedPedido.id, "confirmado")} disabled={saving}>
                          <CheckCircle className="h-4 w-4 mr-2" />Confirmar Pedido
                        </Button>
                        <Button variant="destructive" onClick={() => changeStatus(selectedPedido.id, "cancelado")} disabled={saving}>
                          <XCircle className="h-4 w-4 mr-2" />Cancelar
                        </Button>
                      </>
                    )}
                    {selectedPedido.status === "confirmado" && (
                      <Button onClick={() => changeStatus(selectedPedido.id, "em_separacao")} disabled={saving}>
                        <PackageCheck className="h-4 w-4 mr-2" />Iniciar Separação
                      </Button>
                    )}
                    {selectedPedido.status === "em_separacao" && (
                      <>
                        <Button onClick={() => openRomaneio(selectedPedido)} disabled={saving}>
                          <Truck className="h-4 w-4 mr-2" />Criar Romaneio & Expedir
                        </Button>
                      </>
                    )}
                    {selectedPedido.status === "expedido" && (
                      <Button onClick={() => changeStatus(selectedPedido.id, "entregue")} disabled={saving} className="bg-success hover:bg-success/90 text-success-foreground">
                        <CheckCircle className="h-4 w-4 mr-2" />Confirmar Entrega
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ===== ROMANEIO ===== */}
        <Dialog open={romaneioOpen} onOpenChange={setRomaneioOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-heading">Romaneio de Expedição</DialogTitle></DialogHeader>
            <form onSubmit={async (e) => { await handleRomaneio(e); if (selectedPedido) await changeStatus(selectedPedido.id, "expedido"); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Placa do Veículo</Label>
                  <Input value={romForm.veiculo_placa} onChange={e => setRomForm(f => ({ ...f, veiculo_placa: e.target.value }))} maxLength={10} placeholder="ABC-1234" />
                </div>
                <div className="space-y-2">
                  <Label>Motorista</Label>
                  <Input value={romForm.motorista_nome} onChange={e => setRomForm(f => ({ ...f, motorista_nome: e.target.value }))} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>CPF Motorista</Label>
                  <Input value={romForm.motorista_cpf} onChange={e => setRomForm(f => ({ ...f, motorista_cpf: e.target.value }))} maxLength={14} />
                </div>
                <div className="space-y-2">
                  <Label>Peso Total (kg)</Label>
                  <Input type="number" step="0.01" value={romForm.peso_total} onChange={e => setRomForm(f => ({ ...f, peso_total: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Valor Frete (R$)</Label>
                  <Input type="number" step="0.01" value={romForm.valor_frete} onChange={e => setRomForm(f => ({ ...f, valor_frete: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={romForm.observacoes} onChange={e => setRomForm(f => ({ ...f, observacoes: e.target.value }))} rows={2} maxLength={500} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Criar Romaneio & Expedir
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* ===== LISTA ===== */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-12">
                <PackageCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum pedido de venda registrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidos.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono font-medium">#{p.numero_pedido}</TableCell>
                      <TableCell>{new Date(p.data_pedido).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{p.pessoas?.razao_social || "—"}</TableCell>
                      <TableCell>{p.vendedores?.nome || "—"}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(p.valor_total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={STATUS_MAP[p.status]?.cls}>{STATUS_MAP[p.status]?.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => openDetail(p)}><Eye className="h-4 w-4" /></Button>
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

export default PedidosVenda;
