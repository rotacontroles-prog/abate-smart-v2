import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

export default function AntemortemInspecao() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("lotes_abate").select("*").order("data_abate", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Inspeção Ante-mortem</h1>
          <p className="text-sm text-muted-foreground">Exame clínico e sanitário dos animais vivos</p>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote / Data</TableHead>
                  <TableHead>Animais</TableHead>
                  <TableHead>Status Sanitário</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>{format(new Date(i.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{i.quantidade_animais}</TableCell>
                    <TableCell><Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/10">Liberado para Abate</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => setDialogOpen(true)}>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Detalhes
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
          <DialogHeader><DialogTitle>Parecer Veterinário Ante-mortem</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
             <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg text-xs leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <p>Animais apresentam boas condições de saúde, sem sintomas de doenças infectocontagiosas.</p>
             </div>
             <div className="space-y-2">
                <Label>Observações de Inspeção</Label>
                <Textarea placeholder="Descreva qualquer anomalia observada..." className="h-24 bg-background/50" />
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10"><AlertTriangle className="h-4 w-4 mr-2" /> Seqüestro</Button>
                <Button className="flex-1 bg-emerald-600">Liberar Lote</Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
