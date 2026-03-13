import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Pencil, Package2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Produtos() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("nome", { ascending: true });
    
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const filteredItems = items.filter(i => 
    i.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.codigo_referencia?.includes(searchTerm)
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Package2 className="h-8 w-8 text-primary" />
              Produtos e Cortes
            </h1>
            <p className="text-muted-foreground">Gerenciamento do catálogo de carnes e subprodutos.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2 shadow-lg shadow-emerald-500/20">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou código..." 
                  className="pl-9 bg-background/50 border-border/50 focus:border-primary/50" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[300px]">Descrição do Produto</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço Médio (kg)</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                         <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Carregando...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        Nenhum produto cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.map((i) => (
                    <TableRow key={i.id} className="group border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-semibold">{i.nome}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">{i.descricao || 'Sem descrição'}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground italic">
                        {i.codigo_referencia || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                          Carne Bovina
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-500">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.preco_base || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">0.00 kg</span>
                          <span className="text-[10px] text-muted-foreground">Qtd Mínima: 100 kg</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
