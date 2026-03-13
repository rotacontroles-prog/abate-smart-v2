import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  ClipboardList, 
  Filter, 
  ExternalLink,
  DollarSign,
  Truck,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PedidosVenda() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pedidos_venda")
      .select("*, cliente:pessoas(nome)")
      .order("data_pedido", { ascending: false });
    
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-primary" />
              Pedidos de Venda
            </h1>
            <p className="text-muted-foreground">Emissão de pedidos, faturamento e logística de despacho.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Novo Pedido
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
             <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Aguardando Faturamento</div>
                   <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold mt-2">12</div>
             </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
             <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Prontos p/ Embarque</div>
                   <Truck className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mt-2">5</div>
             </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
             <CardContent className="p-6">
                <div className="flex items-center justify-between">
                   <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Mês (R$)</div>
                   <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold mt-2">R$ 142.5k</div>
             </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="relative w-96 font-medium">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por cliente ou Nº..." className="pl-9 bg-background/50 border-border/50" />
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-background/50">
                <Filter className="h-4 w-4" />
                Filtros Avançados
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[300px]">Cliente</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Carregando...</TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Nenhum pedido recente.</TableCell>
                    </TableRow>
                  ) : items.map((i) => (
                    <TableRow key={i.id} className="border-border/50 group hover:bg-muted/30">
                      <TableCell className="font-mono font-bold">#{Math.floor(Math.random() * 9000) + 1000}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(i.data_pedido), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">{(i as any).cliente?.nome || 'Cliente não identificado'}</div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.valor_total || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 capitalize">
                          {i.status || 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-primary group-hover:scale-110 transition-transform">
                            <ExternalLink className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
