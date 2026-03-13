import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Axe, 
  Scissors, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  Clock,
  Activity
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Abates Hoje", 
    value: "142", 
    change: "+12%", 
    trend: "up",
    icon: Axe, 
    color: "emerald",
    description: "Cabeças processadas hoje"
  },
  { 
    label: "Compras Pendentes", 
    value: "5", 
    change: "-2", 
    trend: "down",
    icon: ShoppingCart, 
    color: "amber",
    description: "Lotes aguardando recepção"
  },
  { 
    label: "Rendimento Médio", 
    value: "54.2%", 
    change: "+0.5%", 
    trend: "up",
    icon: Target, 
    color: "blue",
    description: "Média de carcaça limpa"
  },
  { 
    label: "Ordens Desossa", 
    value: "8", 
    change: "Normal", 
    trend: "neutral",
    icon: Scissors, 
    color: "indigo",
    description: "Fichas em processamento"
  },
];

const slaughterData = [
  { name: "Seg", cabecas: 120, rendimento: 53.5 },
  { name: "Ter", cabecas: 145, rendimento: 54.2 },
  { name: "Qua", cabecas: 132, rendimento: 53.8 },
  { name: "Qui", cabecas: 158, rendimento: 55.1 },
  { name: "Sex", cabecas: 142, rendimento: 54.2 },
  { name: "Sab", cabecas: 85, rendimento: 53.2 },
];

const categoryData = [
  { name: "Boi Casado", value: 45, color: "#10b981" },
  { name: "Dianteiro", value: 25, color: "#3b82f6" },
  { name: "Traseiro", value: 20, color: "#f59e0b" },
  { name: "PA", value: 10, color: "#6366f1" },
];

const recentActivity = [
  { id: 1, type: "compra", user: "João Silva", title: "Nova compra: Fazenda Primavera", time: "Há 10 min", amount: "45 Cab." },
  { id: 2, type: "abate", user: "Sistema", title: "Lote #842 Finalizado", time: "Há 45 min", amount: "54.5% Rend." },
  { id: 3, type: "venda", user: "Maria Oliveira", title: "Novo Pedido: Açougue Central", time: "Há 2 horas", amount: "R$ 12.450" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Dashboard Operacional
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Monitoramento em tempo real do frigorífico.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-card/30 backdrop-blur-md border border-border/50 p-1 rounded-lg">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-background shadow-sm border border-border/50">Hoje</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors">7 dias</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground transition-colors">30 dias</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-300">
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 blur-2xl transition-opacity group-hover:opacity-10",
                stat.color === "emerald" && "bg-emerald-500",
                stat.color === "amber" && "bg-amber-500",
                stat.color === "blue" && "bg-blue-500",
                stat.color === "indigo" && "bg-indigo-500",
              )} />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                  {stat.label}
                </CardTitle>
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  stat.color === "emerald" && "bg-emerald-500/10 text-emerald-500",
                  stat.color === "amber" && "bg-amber-500/10 text-amber-500",
                  stat.color === "blue" && "bg-blue-500/10 text-blue-500",
                  stat.color === "indigo" && "bg-indigo-500/10 text-indigo-500",
                )}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <div className={cn(
                    "text-xs font-bold flex items-center gap-0.5",
                    stat.trend === "up" && "text-emerald-500",
                    stat.trend === "down" && "text-rose-500",
                    stat.trend === "neutral" && "text-muted-foreground"
                  )}>
                    {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                    {stat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <Card className="col-span-full lg:col-span-4 border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Volume de Abate</CardTitle>
                <CardDescription>Comparativo de abates por dia da semana</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-[2px] bg-emerald-500" />
                  <span>Cabeças</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-[2px] bg-blue-500" />
                  <span>Rendimento %</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={slaughterData}>
                    <defs>
                      <linearGradient id="colorCabecas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(10, 10, 10, 0.8)", 
                        borderRadius: "12px", 
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(12px)"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cabecas" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCabecas)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rendimento" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRend)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart / Distribution */}
          <Card className="col-span-full lg:col-span-3 border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Mix de Produção</CardTitle>
              <CardDescription>Distribuição por categoria de carcaça</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(10, 10, 10, 0.8)", 
                        borderRadius: "12px", 
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(12px)"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Activity Feed */}
          <Card className="col-span-full lg:col-span-4 border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex items-center gap-4 group">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-border group-hover:bg-primary/30 transition-colors" />
                    )}
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border border-border/50 bg-background shadow-sm z-10",
                      activity.type === "compra" && "text-emerald-500",
                      activity.type === "abate" && "text-amber-500",
                      activity.type === "venda" && "text-blue-500",
                    )}>
                      {activity.type === "compra" && <ShoppingCart className="h-4 w-4" />}
                      {activity.type === "abate" && <Axe className="h-4 w-4" />}
                      {activity.type === "venda" && <TrendingUp className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold truncate">{activity.title}</p>
                        <span className="text-xs font-bold whitespace-nowrap">{activity.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{activity.user}</span>
                        <span className="text-[10px] text-muted-foreground/50">•</span>
                        <span className="text-xs text-muted-foreground/70">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-full lg:col-span-3 border-border/50 bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "Nova Compra", icon: ShoppingCart, color: "bg-emerald-500/10 text-emerald-500" },
                { label: "Novo Abate", icon: Axe, color: "bg-amber-500/10 text-amber-500" },
                { label: "Tipificação", icon: Target, color: "bg-blue-500/10 text-blue-500" },
                { label: "Novo Pedido", icon: TrendingUp, color: "bg-indigo-500/10 text-indigo-500" },
              ].map((action) => (
                <button 
                  key={action.label}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border/50 bg-background/30 hover:bg-background/50 hover:border-primary/30 transition-all group"
                >
                  <div className={cn("p-3 rounded-lg group-hover:scale-110 transition-transform", action.color)}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
