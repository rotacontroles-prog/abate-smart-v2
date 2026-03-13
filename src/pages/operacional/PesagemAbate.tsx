import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Scale, Save, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function PesagemAbate() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [peso, setPeso] = useState(0);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lotes_abate")
      .select("*")
      .eq("status", "aberto")
      .order("data_abate", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const handleWeight = async () => {
    if (!selectedLote || peso <= 0) return;
    setSaving(true);
    const { error } = await supabase
      .from("lotes_abate")
      .update({ peso_total_vivo: peso, status: "em_processamento" })
      .eq("id", selectedLote.id);
    
    if (error) toast.error(error.message);
    else {
      toast.success("Peso registrado com sucesso!");
      setDialogOpen(false);
      fetch_();
    }
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Pesagem de Abate</h1>
          <p className="text-sm text-muted-foreground">Registro de peso vivo e entrada no fluxo de abate</p>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote / Data</TableHead>
                  <TableHead className="text-right">Animais</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum lote pendente de pesagem</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{format(new Date(i.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">{i.quantidade_animais}</TableCell>
                    <TableCell><Badge variant="outline" className="border-amber-500/20 text-amber-500 bg-amber-500/10">Aguardando Pesagem</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => { setSelectedLote(i); setPeso(i.peso_total_vivo || 0); setDialogOpen(true); }}>
                        <Scale className="h-4 w-4 mr-2" /> Pesar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md border-border/50 bg-card">
          <DialogHeader><DialogTitle>Registrar Pesagem</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between border border-border/50">
              <div className="text-sm">
                <p className="text-muted-foreground">Animais no lote</p>
                <p className="text-lg font-bold">{selectedLote?.quantidade_animais}</p>
              </div>
              <ArrowRight className="text-muted-foreground" />
              <div className="text-right">
                <Label>Peso Total Vivo (kg)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  className="text-2xl font-bold text-emerald-500 text-right h-12"
                  value={peso}
                  onChange={e => setPeso(Number(e.target.value))}
                  autoFocus
                />
              </div>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-11" onClick={handleWeight} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar Peso do Lote
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
