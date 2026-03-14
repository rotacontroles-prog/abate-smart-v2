import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Save, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Configuracoes = () => {
  const { user, profile } = useAuth();
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [plano, setPlano] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (profile) {
      setNome(profile.nome || "");
      fetchTenant();
      checkAdmin();
    }
  }, [profile]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const admin = data?.some(r => r.role === "admin") || false;
    setIsAdmin(admin);
    if (admin) fetchUsuarios();
  };

  const fetchTenant = async () => {
    const { data: t } = await supabase.from("tenants").select("*, planos_saas(*)").single();
    if (t) {
      setTenant(t);
      setPlano((t as any).planos_saas);
    }
  };

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    const { data: profiles } = await supabase.from("profiles").select("id, nome, email, ativo");
    if (profiles) {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const rolesMap = new Map<string, string[]>();
      roles?.forEach(r => {
        const cur = rolesMap.get(r.user_id) || [];
        cur.push(r.role);
        rolesMap.set(r.user_id, cur);
      });
      setUsuarios(profiles.map(p => ({ ...p, roles: rolesMap.get(p.id) || [] })));
    }
    setLoadingUsers(false);
  };

  const handleSavePerfil = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ nome }).eq("id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Perfil atualizado!");
    setSaving(false);
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-primary/10 text-primary border-primary/20",
      gerente: "bg-accent/10 text-accent border-accent/20",
      financeiro: "bg-success/10 text-success border-success/20",
      operador: "bg-muted text-muted-foreground",
      vendedor: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    };
    return <Badge key={role} variant="outline" className={colors[role] || ""}>{role}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading">Configurações</h1>
          <p className="text-sm text-muted-foreground">Perfil, plano e gestão de usuários</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base font-heading">Meu Perfil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={nome} onChange={e => setNome(e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={profile?.email || user?.email || ""} disabled className="opacity-60" />
              </div>
              <Button onClick={handleSavePerfil} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </CardContent>
          </Card>

          {/* Tenant & Plan */}
          <Card className="border-border/50">
            <CardHeader><CardTitle className="text-base font-heading">Organização & Plano</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organização</Label>
                <Input value={tenant?.nome || "—"} disabled className="opacity-60" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {tenant?.status || "—"}
                  </Badge>
                </div>
              </div>
              <Separator />
              {plano ? (
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Plano:</span> <strong>{plano.nome}</strong></p>
                  <p><span className="text-muted-foreground">Limite Usuários:</span> {plano.limite_usuarios}</p>
                  <p><span className="text-muted-foreground">Limite NF-e/mês:</span> {plano.limite_nfe_mes}</p>
                  <p><span className="text-muted-foreground">Contabilidade:</span> {plano.acesso_contabilidade ? "Sim" : "Não"}</p>
                  <p><span className="text-muted-foreground">CNAB:</span> {plano.acesso_cnab ? "Sim" : "Não"}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum plano associado</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Management (admin only) */}
        {isAdmin && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <Shield className="h-4 w-4" /> Usuários do Tenant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : usuarios.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Nenhum usuário encontrado</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.nome || "—"}</TableCell>
                        <TableCell>{u.email || "—"}</TableCell>
                        <TableCell><div className="flex gap-1 flex-wrap">{u.roles.map(roleBadge)}</div></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={u.ativo ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                            {u.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
