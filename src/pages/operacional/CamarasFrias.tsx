import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Snowflake, 
  Thermometer, 
  Box, 
  ArrowRight,
  Plus,
  AlertCircle,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

const chambers = [
  { 
    id: 1, 
    name: "Câmara Fria 01 - Resfriamento", 
    temp: -2.4, 
    humidity: 85, 
    occupancy: 78, 
    status: "normal",
    lastPulse: "Há 2 min",
    items: 45
  },
  { 
    id: 2, 
    name: "Câmara Fria 02 - Congelamento", 
    temp: -18.2, 
    humidity: 92, 
    occupancy: 42, 
    status: "normal",
    lastPulse: "Há 5 min",
    items: 124
  },
  { 
    id: 3, 
    name: "Câmara Fria 03 - Expedição", 
    temp: 4.1, 
    humidity: 65, 
    occupancy: 95, 
    status: "warning",
    lastPulse: "Há 1 min",
    items: 312
  },
  { 
    id: 4, 
    name: "Túnel de Congelamento 01", 
    temp: -32.5, 
    humidity: 98, 
    occupancy: 100, 
    status: "full",
    lastPulse: "Agora",
    items: 68
  },
];

export default function CamarasFrias() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
              <Snowflake className="h-8 w-8 text-primary" />
              Câmaras Frias
            </h1>
            <p className="text-muted-foreground">Monitoramento de temperatura e ocupação de estoque.</p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="border-border/50 bg-background/50 gap-2">
              <History className="h-4 w-4" />
              Histórico
            </Button>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Configurar Sensor
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {chambers.map((c) => (
            <Card key={c.id} className="border-border/50 bg-card/40 backdrop-blur-xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        c.status === 'warning' ? "bg-amber-500/10 text-amber-500" : 
                        c.status === 'full' ? "bg-rose-500/10 text-rose-500" : 
                        "bg-emerald-500/10 text-emerald-500"
                      )}>
                        <Thermometer className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-0.5">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            c.status === 'warning' ? "bg-amber-500" : 
                            c.status === 'full' ? "bg-rose-500" : 
                            "bg-emerald-500"
                          )} />
                          Ativo • {c.lastPulse}
                        </CardDescription>
                      </div>
                   </div>
                   <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="h-4 w-4" />
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
                       <div className="text-sm text-muted-foreground font-medium">Temp.</div>
                       <div className={cn(
                         "text-2xl font-bold tracking-tighter",
                         c.temp > 0 ? "text-rose-500" : "text-blue-500"
                       )}>
                         {c.temp}°C
                       </div>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex items-center justify-between">
                       <div className="text-sm text-muted-foreground font-medium">Umidade</div>
                       <div className="text-2xl font-bold tracking-tighter text-emerald-500">
                         {c.humidity}%
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2 font-medium">
                          <Box className="h-4 w-4 text-muted-foreground" />
                          Ocupação ({c.items} itens)
                       </div>
                       <span className={cn(
                         "font-bold",
                         c.occupancy > 90 ? "text-rose-500" : "text-muted-foreground"
                       )}>{c.occupancy}%</span>
                    </div>
                    <Progress 
                      value={c.occupancy} 
                      className="h-2 bg-muted/50" 
                      indicatorClassName={cn(
                        c.occupancy > 90 ? "bg-rose-500" : 
                        c.occupancy > 70 ? "bg-amber-500" : 
                        "bg-primary"
                      )}
                    />
                 </div>

                 {c.status === 'warning' && (
                   <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Limite de temperatura próximo da margem de segurança (Max 5.0°C).
                   </div>
                 )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
