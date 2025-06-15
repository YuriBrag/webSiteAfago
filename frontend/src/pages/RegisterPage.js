import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage1 from '../assets/background_lp.jpg';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [telefone, setTelefone] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

   const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = {
            email,
            password,
            nomeCompleto,
            cpfCnpj,
            telefone
        };

        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), 
            });

            const responseData = await response.json();
            setLoading(false);

            if (!response.ok) {
                throw new Error(responseData.message || 'Falha ao tentar cadastrar.');
            }
            
            setSuccess(responseData.message);
            setTimeout(() => {
                navigate('/entrar');
            }, 2000);

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
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Criar Nova Conta</h2>
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-4">{error}</div>}
                    {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center mb-4">{success}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="nomeCompleto" className="block text-gray-700 text-sm font-semibold mb-2">Nome Completo</label>
                            <input type="text" id="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
                        </div>
                         <div>
                            <label htmlFor="cpfCnpj" className="block text-gray-700 text-sm font-semibold mb-2">CPF ou CNPJ</label>
                            <input type="text" id="cpfCnpj" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
                        </div>
                         <div>
                            <label htmlFor="telefone" className="block text-gray-700 text-sm font-semibold mb-2">Telefone</label>
                            <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors mt-6">
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>
                    <p className="text-center text-gray-600 text-sm mt-8">
                        Já tem uma conta?{' '}
                        <Link to="/entrar" className="font-semibold text-green-600 hover:text-green-800">
                            Faça o login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;