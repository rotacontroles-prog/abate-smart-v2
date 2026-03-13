import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center p-4">
      <h1 className="text-9xl font-heading font-bold text-primary/20">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Página não encontrada</h2>
      <p className="text-muted-foreground mt-2 max-w-xs">O link que você acessou pode estar quebrado ou a página foi removida.</p>
      <Button className="mt-8" onClick={() => navigate("/")}>Voltar para o Início</Button>
    </div>
  );
}
