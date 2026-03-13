import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Globe, Mail, Phone, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Empresas() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .order("name", { ascending: true });
    
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
              <Building2 className="h-8 w-8 text-primary" />
              Empresas e Unidades
            </h1>
            <p className="text-muted-foreground">Configuração de empresas, filiais e múltiplos tenants.</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-500 gap-2 shadow-lg shadow-emerald-500/20">
            <Plus className="h-4 w-4" />
            Nova Unidade
          </Button>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <Card className="border-border/50 bg-card/40 backdrop-blur-xl p-12 flex justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Carregando unidades...
              </div>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-border/50 bg-card/40 backdrop-blur-xl p-12 text-center text-muted-foreground">
              Nenhuma empresa ou unidade configurada.
            </Card>
          ) : items.map((i) => (
            <Card key={i.id} className="group border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 bg-muted/20 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-border/50">
                   <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                   </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{i.name}</h3>
                        <Badge variant="outline" className="bg-primary/5 text-primary">Matriz</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground uppercase tracking-tight font-mono mt-1">ID: {i.slug || '-'}</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="icon" className="h-9 w-9 border border-border/50 bg-background/50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="icon" className="h-9 w-9 border border-border/50 bg-background/50 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {i.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {i.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      {i.website || 'www.frigorifico.com.br'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-xs">
                        <p className="text-muted-foreground font-medium">Plano Atual</p>
                        <p className="font-bold text-primary">AbateSmart Enterprise</p>
                      </div>
                    </div>
                    <Button variant="link" className="text-primary text-xs h-auto p-0 underline-offset-4">Gerenciar Configurações</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
