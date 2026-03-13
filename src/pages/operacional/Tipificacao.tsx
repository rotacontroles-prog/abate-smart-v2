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
import { Loader2, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";

export default function Tipificacao() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFicha, setSelectedFicha] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("fichas_abate")
      .select("*")
      .eq("status", "aberto")
      .order("data_abate", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Tipificação / Classificação</h1>
          <p className="text-sm text-muted-foreground">Classificação de carcaças, acabamento e pH</p>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ficha</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Animais</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma ficha pendente de tipificação</TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono font-bold">#{i.numero_ficha}</TableCell>
                    <TableCell>{format(new Date(i.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right">{i.quantidade_animais}</TableCell>
                    <TableCell><Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/10">Abate Iniciado</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedFicha(i); setDialogOpen(true); }}>
                        <ClipboardCheck className="h-4 w-4 mr-2" /> Classificar
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
        <DialogContent className="max-w-2xl border-border/50 bg-card">
          <DialogHeader><DialogTitle>Classificação de Carcaças - Ficha #{selectedFicha?.numero_ficha}</DialogTitle></DialogHeader>
          <div className="space-y-6 pt-4">
             <p className="text-sm text-muted-foreground italic">Protótipo: Aqui será implementada a entrada rápida de dados por carcaça.</p>
             <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Acabamento (0-4)</Label><Input type="number" placeholder="Ex: 2" /></div>
                <div className="space-y-2"><Label>Dentição</Label><Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="dl">DL</SelectItem><SelectItem value="2d">2D</SelectItem><SelectItem value="4d">4D</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>pH Final</Label><Input type="number" step="0.1" placeholder="Ex: 5.8" /></div>
             </div>
             <Button className="w-full" disabled={saving}>Salvar Lote de Classificação</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
