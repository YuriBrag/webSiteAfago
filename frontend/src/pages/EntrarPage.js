import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage1 from '../assets/background_lp.jpg';

function EntrarPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const responseData = await response.json();
            setLoading(false);

            if (!response.ok) {
                if (response.status === 404) {
                    setError(
                        <span>
                            Usuário não encontrado. <Link to="/registrar" className="font-bold underline hover:text-blue-500">Crie uma conta.</Link>
                        </span>
                    );
                } else {
                    throw new Error(responseData.message || 'Falha no login.');
                }
                return;
            }
            
            if (responseData.token && responseData.userEmail) {
                localStorage.setItem('authToken', responseData.token);
                localStorage.setItem('userEmail', responseData.userEmail); 
                if (responseData.userName) {
                    localStorage.setItem('userName', responseData.userName);
                }
              
                if (responseData.userRole) {
                    localStorage.setItem('userRole', responseData.userRole);
                }

            } else {
                throw new Error('Resposta de login inválida do servidor.');
            }
          
            navigate('/perfil');
            window.location.reload();

        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-fixed relative flex flex-col justify-center items-center p-4 pt-24"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
        >
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <div className="relative z-10 w-full flex justify-center">
                <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-lg shadow-xl">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Entrar na Plataforma</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password"  className="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-8">
                        Não tem uma conta?{' '}
                        <Link to="/registrar" className="font-semibold text-green-600 hover:text-green-800">
                            Crie uma agora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EntrarPage;
