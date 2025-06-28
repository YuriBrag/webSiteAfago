import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import LandingPage from './pages/LandingPage.js';
import EntrarPage from './pages/EntrarPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ContactsPage from './pages/ContactsPage.js';
import RegisterPage from "./pages/RegisterPage.js";
import ProtectedRoute from './components/ProtectedRoute.js';
import ResponderFormularioPage from './pages/ResponderFormulariosPage.js';
import ListarFormulariosPage from './pages/ListarFormulariosPage.js';
import OutraPagina from './pages/OutraPagina.js';
import AdminProtectedRoute from './components/AdminProtectedRoute.js';
import AdminPage from './pages/AdminPage.js'
import RelatoriosPage from './pages/RelatoriosPage';
import RelatoriosAdminPage from './pages/RelatoriosAdminPage';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/entrar" element={<EntrarPage />} />
                <Route path="/registrar" element={<RegisterPage />} />
                <Route path="/contatos" element={<ContactsPage />} />
                <Route path="/outra-pagina" element={<OutraPagina />} />

                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route path="/responder-formulario" element={<ResponderFormularioPage />} />
                    <Route path="/listar-formularios" element={<ListarFormulariosPage />} />
                    <Route path="/relatorios" element={<RelatoriosPage />} />
                </Route>
                {/* Rota Protegida para Administradores */}
                <Route element={<AdminProtectedRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/relatorios-admin" element={<RelatoriosAdminPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
