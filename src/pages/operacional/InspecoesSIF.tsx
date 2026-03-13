import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileCheck, Search } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export default function InspecoesSIF() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await supabase.from("fichas_abate").select("*").order("data_abate", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Inspeções Post-mortem (SIF)</h1>
            <p className="text-sm text-muted-foreground">Controle de Linhas de Inspeção Federal</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por ficha..." className="pl-9 w-64 bg-card/50" />
          </div>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ficha</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Condenações</TableHead>
                  <TableHead>Status SIF</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono font-bold">#{i.numero_ficha}</TableCell>
                    <TableCell>{format(new Date(i.data_abate + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-right text-destructive font-bold">0</TableCell>
                    <TableCell><Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/10">Concluída</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => setDialogOpen(true)}>
                        <FileCheck className="h-4 w-4 mr-2" /> Relatório
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
        <DialogContent className="max-w-lg border-border/50 bg-card">
          <DialogHeader><DialogTitle>Relatório de Inspeção SIF</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4 text-sm">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded border-border/50 bg-muted/20"><p className="text-xs text-muted-foreground">Linha A (Vísceras Vermelhas)</p><p className="font-bold">Nenhuma Condenação</p></div>
                <div className="p-3 border rounded border-border/50 bg-muted/20"><p className="text-xs text-muted-foreground">Linha B (Vísceras Brancas)</p><p className="font-bold">Nenhuma Condenação</p></div>
                <div className="p-3 border rounded border-border/50 bg-muted/20"><p className="text-xs text-muted-foreground">Linha C (Cabeça e Língua)</p><p className="font-bold">Nenhuma Condenação</p></div>
                <div className="p-3 border rounded border-border/50 bg-muted/20"><p className="text-xs text-muted-foreground">DIF (Departamento de Inspeção Final)</p><p className="font-bold text-emerald-500">Fluxo Normal</p></div>
             </div>
             <Button className="w-full" onClick={() => setDialogOpen(false)}>Fechar Relatório</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
