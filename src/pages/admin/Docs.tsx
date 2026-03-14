import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import ReactMarkdown from "react-markdown";
import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCS = [
  { key: "readme", label: "Visão Geral", file: "README.md" },
  { key: "database", label: "Database", file: "database.md" },
  { key: "edge-functions", label: "Edge Functions", file: "edge-functions.md" },
  { key: "frontend", label: "Frontend", file: "frontend.md" },
  { key: "deploy-ops", label: "Deploy & Ops", file: "deploy-ops.md" },
];

const AdminDocs = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeDoc, setActiveDoc] = useState("readme");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setIsAdmin(data?.some((r) => r.role === "admin") ?? false);
      });
  }, [user]);

  useEffect(() => {
    const loadDocs = async () => {
      const docs: Record<string, string> = {};
      for (const doc of DOCS) {
        try {
          const res = await fetch(`/docs/${doc.file}`);
          if (res.ok) docs[doc.key] = await res.text();
          else docs[doc.key] = `> Erro ao carregar ${doc.file}`;
        } catch {
          docs[doc.key] = `> Arquivo não disponível: ${doc.file}`;
        }
      }
      setContent(docs);
      setLoading(false);
    };
    loadDocs();
  }, []);

  if (isAdmin === null) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <AppLayout>
      <div className="flex gap-6 min-h-[calc(100vh-3rem)]">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 space-y-1 pt-2">
          <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest px-3 py-2">
            Documentação
          </p>
          {DOCS.map((doc) => (
            <button
              key={doc.key}
              onClick={() => setActiveDoc(doc.key)}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors text-left",
                activeDoc === doc.key
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4 shrink-0" />
              {doc.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <article className="prose prose-invert prose-sm max-w-none
                prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-wider
                prose-h1:text-2xl prose-h1:border-b prose-h1:border-border/50 prose-h1:pb-3
                prose-h2:text-xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2
                prose-h3:text-lg prose-h3:mt-6
                prose-table:text-xs
                prose-th:bg-muted prose-th:px-3 prose-th:py-2
                prose-td:px-3 prose-td:py-1.5 prose-td:border-border/30
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-muted prose-pre:border prose-pre:border-border/30
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-primary/50
                prose-strong:text-foreground
              ">
                <ReactMarkdown>{content[activeDoc] || ""}</ReactMarkdown>
              </article>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDocs;
