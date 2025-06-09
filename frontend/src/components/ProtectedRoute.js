// frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken');

  // Se o token existe, renderiza a rota filha (ex: ProfilePage)
  // Se não existe, redireciona para a página de login
  return token ? <Outlet /> : <Navigate to="/entrar" />;
};

export default ProtectedRoute;