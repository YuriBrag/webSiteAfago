import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    // Redireciona se não houver token ou se o papel não for 'admin'
    if (!token || userRole !== 'admin') {
        return <Navigate to="/entrar" replace />;
    }

    // Se tudo estiver OK, renderiza as rotas filhas
    return <Outlet />;
};

export default AdminProtectedRoute;