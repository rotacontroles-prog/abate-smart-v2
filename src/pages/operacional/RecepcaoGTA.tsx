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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, CheckCircle, Search, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RecepcaoGTA() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("animais_compra")
      .select("*, pessoas(razao_social)")
      .order("data_compra", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const handleReceive = async () => {
    if (!selectedItem) return;
    setProcessing(true);
    const { error } = await supabase
      .from("animais_compra")
      .update({ status: "recebido" })
      .eq("id", selectedItem.id);
    
    if (error) toast.error(error.message);
    else {
      toast.success("GTA recebida e conferida!");
      setDialogOpen(false);
      fetch_();
    }
    setProcessing(false);
  };

  const filteredItems = items.filter(i => 
    i.numero_gta?.toLowerCase().includes(search.toLowerCase()) ||
    i.pessoas?.razao_social?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Recepção de Animais / GTA</h1>
          <p className="text-sm text-muted-foreground">Conferência de chegada e documentos sanitários</p>
        </div>

        <div className="flex items-center gap-4 bg-card/50 p-4 rounded-lg border border-border/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por GTA ou Fornecedor..." 
              className="pl-9 bg-background/50" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data Compra</TableHead>
                  <TableHead>GTA</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow> : filteredItems.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum registro encontrado</TableCell></TableRow> : filteredItems.map(i => (
                  <TableRow key={i.id} className={cn(i.status === "recebido" && "opacity-60 bg-muted/20")}>
                    <TableCell>{format(new Date(i.data_compra + "T12:00:00"), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="font-mono font-bold text-emerald-500">{i.numero_gta || "S/N"}</TableCell>
                    <TableCell>{i.pessoas?.razao_social}</TableCell>
                    <TableCell className="text-right font-semibold">{i.quantidade} animais</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={i.status === "recebido" ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/10" : "animate-pulse border-amber-500/20 text-amber-500 bg-amber-500/10"}>
                        {i.status === "recebido" ? "Conferido" : "Aguardando"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant={i.status === "recebido" ? "ghost" : "default"}
                        disabled={i.status === "recebido"}
                        onClick={() => { setSelectedItem(i); setDialogOpen(true); }}
                      >
                        {i.status === "recebido" ? <CheckCircle className="h-4 w-4 mr-2" /> : <ClipboardList className="h-4 w-4 mr-2" />}
                        {i.status === "recebido" ? "Concluído" : "Conferir"}
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
          <DialogHeader><DialogTitle>Conferência de GTA</DialogTitle></DialogHeader>
          {selectedItem && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1"><Label className="text-muted-foreground">Fornecedor</Label><p className="font-medium">{selectedItem.pessoas?.razao_social}</p></div>
                <div className="space-y-1"><Label className="text-muted-foreground">GTA nº</Label><p className="font-bold text-emerald-500">{selectedItem.numero_gta}</p></div>
                <div className="space-y-1"><Label className="text-muted-foreground">Animais</Label><p className="font-medium">{selectedItem.quantidade}</p></div>
                <div className="space-y-1"><Label className="text-muted-foreground">Data Compra</Label><p className="font-medium">{format(new Date(selectedItem.data_compra + "T12:00:00"), "dd/MM/yyyy")}</p></div>
              </div>
              <Separator />
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded text-xs text-amber-200">
                Certifique-se de que os animais conferem com a documentação sanitária apresentada.
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500" onClick={handleReceive} disabled={processing}>
                {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Confirmar Recebimento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
