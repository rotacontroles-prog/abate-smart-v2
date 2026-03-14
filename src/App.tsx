import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Operacional
import LotesAbate from "./pages/operacional/LotesAbate";
import RecepcaoGTA from "./pages/operacional/RecepcaoGTA";
import PesagemAbate from "./pages/operacional/PesagemAbate";
import Tipificacao from "./pages/operacional/Tipificacao";
import AntemortemInspecao from "./pages/operacional/AntemortemInspecao";
import InspecoesSIF from "./pages/operacional/InspecoesSIF";
import FichasAbate from "./pages/operacional/FichasAbate";
import AnimaisCompra from "./pages/operacional/AnimaisCompra";
import OrdensDesossa from "./pages/operacional/OrdensDesossa";
import CortesDesossa from "./pages/operacional/CortesDesossa";
import CamarasFrias from "./pages/operacional/CamarasFrias";

// Cadastros
import Pessoas from "./pages/cadastros/Pessoas";
import Empresas from "./pages/cadastros/Empresas";
import Produtos from "./pages/cadastros/Produtos";
import Vendedores from "./pages/cadastros/Vendedores";

// Comercial
import PedidosVenda from "./pages/comercial/PedidosVenda";

// Financeiro
import ContasPagar from "./pages/financeiro/ContasPagar";
import ContasReceber from "./pages/financeiro/ContasReceber";
import PlanoContas from "./pages/financeiro/PlanoContas";
import Lancamentos from "./pages/financeiro/Lancamentos";
import FluxoCaixa from "./pages/financeiro/FluxoCaixa";
import ContasBancarias from "./pages/financeiro/ContasBancarias";

// Outros
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import AdminDocs from "./pages/admin/Docs";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Core */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />

              {/* Operacional */}
              <Route path="/operacional/lotes" element={<ProtectedRoute><LotesAbate /></ProtectedRoute>} />
              <Route path="/operacional/recepcao" element={<ProtectedRoute><RecepcaoGTA /></ProtectedRoute>} />
              <Route path="/operacional/pesagem" element={<ProtectedRoute><PesagemAbate /></ProtectedRoute>} />
              <Route path="/operacional/tipificacao" element={<ProtectedRoute><Tipificacao /></ProtectedRoute>} />
              <Route path="/operacional/inspecao-antemortem" element={<ProtectedRoute><AntemortemInspecao /></ProtectedRoute>} />
              <Route path="/operacional/inspecoes-sif" element={<ProtectedRoute><InspecoesSIF /></ProtectedRoute>} />
              <Route path="/operacional/abate" element={<ProtectedRoute><FichasAbate /></ProtectedRoute>} />
              <Route path="/operacional/animais" element={<ProtectedRoute><AnimaisCompra /></ProtectedRoute>} />
              <Route path="/operacional/desossa" element={<ProtectedRoute><OrdensDesossa /></ProtectedRoute>} />
              <Route path="/operacional/cortes" element={<ProtectedRoute><CortesDesossa /></ProtectedRoute>} />
              <Route path="/operacional/camaras" element={<ProtectedRoute><CamarasFrias /></ProtectedRoute>} />

              {/* Comercial */}
              <Route path="/comercial/pedidos" element={<ProtectedRoute><PedidosVenda /></ProtectedRoute>} />

              {/* Cadastros */}
              <Route path="/cadastros/pessoas" element={<ProtectedRoute><Pessoas /></ProtectedRoute>} />
              <Route path="/cadastros/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
              <Route path="/cadastros/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
              <Route path="/cadastros/vendedores" element={<ProtectedRoute><Vendedores /></ProtectedRoute>} />

              {/* Financeiro */}
              <Route path="/financeiro/pagar" element={<ProtectedRoute><ContasPagar /></ProtectedRoute>} />
              <Route path="/financeiro/receber" element={<ProtectedRoute><ContasReceber /></ProtectedRoute>} />
              <Route path="/financeiro/plano-contas" element={<ProtectedRoute><PlanoContas /></ProtectedRoute>} />
              <Route path="/financeiro/lancamentos" element={<ProtectedRoute><Lancamentos /></ProtectedRoute>} />
              <Route path="/financeiro/fluxo" element={<ProtectedRoute><FluxoCaixa /></ProtectedRoute>} />
              <Route path="/financeiro/contas-bancarias" element={<ProtectedRoute><ContasBancarias /></ProtectedRoute>} />

              {/* Outros */}
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              <Route path="/admin/docs" element={<ProtectedRoute><AdminDocs /></ProtectedRoute>} />

              {/* Not Found */}
              <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
