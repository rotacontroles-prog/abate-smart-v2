import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FichasAbate from "./pages/operacional/FichasAbate";
import AnimaisCompra from "./pages/operacional/AnimaisCompra";
import RecepcaoGTA from "./pages/operacional/RecepcaoGTA";
import PesagemAbate from "./pages/operacional/PesagemAbate";
import Tipificacao from "./pages/operacional/Tipificacao";
import AntemortemInspecao from "./pages/operacional/AntemortemInspecao";
import InspecoesSIF from "./pages/operacional/InspecoesSIF";
import LotesAbate from "./pages/operacional/LotesAbate";
import OrdensDesossa from "./pages/operacional/OrdensDesossa";
import CortesDesossa from "./pages/operacional/CortesDesossa";
import Pessoas from "./pages/cadastros/Pessoas";
import Empresas from "./pages/cadastros/Empresas";
import Produtos from "./pages/cadastros/Produtos";
import CamarasFrias from "./pages/operacional/CamarasFrias";
import PedidosVenda from "./pages/comercial/PedidosVenda";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
          
          <Route path="/comercial/pedidos" element={<ProtectedRoute><PedidosVenda /></ProtectedRoute>} />
          
          <Route path="/cadastros/pessoas" element={<ProtectedRoute><Pessoas /></ProtectedRoute>} />
          <Route path="/cadastros/empresas" element={<ProtectedRoute><Empresas /></ProtectedRoute>} />
          <Route path="/cadastros/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
