import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import icone from "./assets/icone.png";
import backgroundImage1 from "./assets/background_lp.jpg";
import backgroundImage2 from "./assets/background_lp_2.jpg";

import LandingPage from './pages/LandingPage.js'; 

import EntrarPage from './pages/EntrarPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ContactsPage from './pages/ContactsPage.js';
import RegisterPage from "./pages/RegisterPage.js";

import ProtectedRoute from './components/ProtectedRoute.js';

import FormsPage from './pages/FormsPage.js';
import ResponderFormularioPage from './pages/ResponderFormulariosPage.js';
import ListarFormulariosPage from './pages/ListarFormulariosPage.js';

import OutraPagina from './pages/OutraPagina.js';

import AdminProtectedRoute from './components/AdminProtectedRoute.js';
import AdminPage from './pages/AdminPage.js'
 

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
                {/* <Route path="/formularios" element={<FormsPage />} /> */}

                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route path="/responder-formulario" element={<ResponderFormularioPage />} />
                    <Route path="/listar-formularios" element={<ListarFormulariosPage />} />
                    
                </Route>
                {/* Rota Protegida para Administradores */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                  {/* Adicione outras rotas de admin aqui, ex: /admin/editar-usuario/:id */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;