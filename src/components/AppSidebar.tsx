import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Beef,
  LayoutDashboard,
  ShoppingCart,
  Axe,
  Scissors,
  PackageOpen,
  Snowflake,
  Users,
  Building2,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/", group: "Geral" },
  { label: "Pedidos Venda", icon: ClipboardList, path: "/comercial/pedidos", group: "Comercial" },
  { label: "Compra Animais", icon: ShoppingCart, path: "/operacional/animais", group: "Operacional" },
  { label: "Fichas Abate", icon: Axe, path: "/operacional/abate", group: "Operacional" },
  { label: "Ordens Desossa", icon: Scissors, path: "/operacional/desossa", group: "Operacional" },
  { label: "Cortes Desossa", icon: PackageOpen, path: "/operacional/cortes", group: "Operacional" },
  { label: "Câmaras Frias", icon: Snowflake, path: "/operacional/camaras", group: "Operacional" },
  { label: "Pessoas", icon: Users, path: "/cadastros/pessoas", group: "Cadastros" },
  { label: "Empresas", icon: Building2, path: "/cadastros/empresas", group: "Cadastros" },
  { label: "Produtos", icon: Package, path: "/cadastros/produtos", group: "Cadastros" },
  { label: "Configurações", icon: Settings, path: "/configuracoes", group: "Sistema" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, profile } = useAuth();

  const groups = [...new Set(navItems.map(i => i.group))];

  return (
    <aside className={cn(
      "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="p-2 rounded-lg bg-primary shrink-0">
          <Beef className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-heading font-bold text-lg tracking-tight">AbateSmart</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-6">
        {groups.map(group => (
          <div key={group} className="space-y-1">
            {!collapsed && <h3 className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{group}</h3>}
            {navItems.filter(i => i.group === group).map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-1">
        {!collapsed && profile && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs font-medium truncate">{profile.nome || profile.email}</p>
            <p className="text-[10px] text-muted-foreground truncate uppercase">{profile.role || 'Operador'}</p>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start gap-3 h-9 px-3 text-muted-foreground hover:text-destructive" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sair"}
        </Button>
        <Button variant="ghost" size="icon" className="w-full h-9 text-muted-foreground" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
