import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Lancamentos = () => {
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lancamentos_contabeis")
        .select(`
          id, data_lancamento, valor, historico, origem_tipo, origem_id, created_at,
          conta_debito:plano_contas!lancamentos_contabeis_conta_debito_id_fkey(codigo, descricao),
          conta_credito:plano_contas!lancamentos_contabeis_conta_credito_id_fkey(codigo, descricao)
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) toast.error(error.message);
      else setLancamentos(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading">Lançamentos Contábeis</h1>
          <p className="text-sm text-muted-foreground">Registro imutável de débitos e créditos</p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : lancamentos.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhum lançamento registrado</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Débito</TableHead>
                    <TableHead>Crédito</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Histórico</TableHead>
                    <TableHead>Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentos.map(l => (
                    <TableRow key={l.id}>
                      <TableCell>{new Date(l.data_lancamento).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{l.conta_debito?.codigo}</span>
                        <span className="ml-2 text-sm">{l.conta_debito?.descricao}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">{l.conta_credito?.codigo}</span>
                        <span className="ml-2 text-sm">{l.conta_credito?.descricao}</span>
                      </TableCell>
                      <TableCell>{formatCurrency(l.valor)}</TableCell>
                      <TableCell className="text-sm">{l.historico}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.origem_tipo || "—"}</TableCell>
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

export default Lancamentos;
