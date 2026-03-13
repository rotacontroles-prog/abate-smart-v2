import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, UserPlus, Users, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Pessoas() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pessoas")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) toast.error(error.message);
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const filteredItems = items.filter(i => 
    i.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.cpf_cnpj?.includes(searchTerm)
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Pessoas
            </h1>
            <p className="text-muted-foreground">Gerenciamento de clientes, fornecedores e produtores.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2 shadow-lg shadow-emerald-500/20">
            <UserPlus className="h-4 w-4" />
            Cadastrar Pessoa
          </Button>
        </div>

        <Card className="border-border/50 bg-card/40 backdrop-blur-xl">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou CPF/CNPJ..." 
                  className="pl-9 bg-background/50 border-border/50 focus:border-primary/50" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-background/50">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <div className="text-xs text-muted-foreground font-medium">
                  Total: {filteredItems.length} registros
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[300px]">Nome / Razão Social</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead>Status</TableHead>
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
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.map((i) => (
                    <TableRow key={i.id} className="group border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="font-semibold">{i.nome}</div>
                        <div className="text-xs text-muted-foreground">{i.email || 'Sem e-mail'}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{i.cpf_cnpj || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-background/50">
                          {i.tipo_pessoa === 'PF' ? 'Física' : 'Jurídica'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {i.cidade || '-'}/{i.uf || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs">Ativo</span>
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
