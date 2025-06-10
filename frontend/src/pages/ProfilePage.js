import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage1 from '../assets/background_lp.jpg';

// Componente para o card do Perfil
const ProfileCard = ({ userName, userEmail }) => (
    <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Perfil</h2>
        <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-lg">{userName || 'Carregando...'}</p>
                <p className="text-gray-600 text-sm">{userEmail || 'Carregando...'}</p>
            </div>
        </div>
        <div className="text-right">
            <Link to="/editar-perfil" className="text-blue-600 hover:underline text-sm font-semibold">
                Editar Perfil
            </Link>
        </div>
    </div>
);

// Componente para o card de Propriedades
const PropertiesCard = ({ properties, onAddProperty, onSelectProperty, selectedProperty }) => {
    const [newPropertyName, setNewPropertyName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPropertyName.trim()) {
            onAddProperty(newPropertyName);
            setNewPropertyName('');
        }
    };
    return (
        <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Gerenciar Propriedades</h2>
            <ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {properties.map((prop, index) => (
                    <li key={index} 
                        onClick={() => onSelectProperty(prop)}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${selectedProperty === prop ? 'bg-green-200 font-bold' : 'hover:bg-gray-200'}`}>
                        {prop}
                    </li>
                ))}
                {properties.length === 0 && <li className="text-gray-500">Nenhuma propriedade registrada.</li>}
            </ul>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
                <input
                    type="text"
                    value={newPropertyName}
                    onChange={(e) => setNewPropertyName(e.target.value)}
                    placeholder="Nome da nova propriedade"
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold text-xl">
                    +
                </button>
            </form>
        </div>
    );
};

// Componente para o card de Áreas
const AreasCard = ({ areas, selectedProperty, onAddArea }) => {
    const [newAreaName, setNewAreaName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newAreaName.trim()) {
            onAddArea(newAreaName);
            setNewAreaName('');
        }
    };
    const filteredAreas = areas
        .filter(area => area.startsWith(`${selectedProperty}:`))
        .map(area => area.split(':')[1]);
    return (
        <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Gerenciar Áreas</h2>
            {!selectedProperty ? (
                <p className="text-gray-500">Selecione uma propriedade para ver as áreas.</p>
            ) : (
                <>
                    <p className="font-semibold mb-2">Áreas de: <span className="text-green-700">{selectedProperty}</span></p>
                    <ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
                       {filteredAreas.map((area, index) => (
                           <li key={index} className="p-2 rounded-md bg-gray-50">{area}</li>
                       ))}
                       {filteredAreas.length === 0 && <li className="text-gray-500">Nenhuma área registrada para esta propriedade.</li>}
                    </ul>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
                        <input
                            type="text"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder="Nome da nova área"
                            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold text-xl">
                            +
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};


function ProfilePage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [properties, setProperties] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [error, setError] = useState('');

    const fetchData = useCallback(async (email) => {
        try {
            const response = await fetch(`http://localhost:5001/api/profile-data?email=${email}`);
            if (!response.ok) throw new Error('Falha ao buscar dados do perfil.');
            const data = await response.json();
            setProperties(data.properties || []);
            setAreas(data.areas || []);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const storedUserEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('authToken');

        if (!token || !storedUserEmail) {
            navigate('/entrar');
        } else {
            setUserName(storedUserName);
            setUserEmail(storedUserEmail);
            fetchData(storedUserEmail);
        }
    }, [navigate, fetchData]);

    const handleAddProperty = async (propertyName) => {
        try {
            const response = await fetch('http://localhost:5001/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, propertyName }),
            });
            if (!response.ok) throw new Error('Falha ao adicionar propriedade.');
            setProperties(prev => [...prev, propertyName]);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleAddArea = async (areaName) => {
        if (!selectedProperty) {
            setError("Por favor, selecione uma propriedade primeiro.");
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/api/areas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, propertyName: selectedProperty, areaName }),
            });
            if (!response.ok) throw new Error('Falha ao adicionar área.');
            setAreas(prev => [...prev, `${selectedProperty}:${areaName}`]);
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
        <div
            className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-fixed relative flex flex-col items-start p-4 md:p-8 pt-48" // <-- ALTERADO PARA pt-48
            style={{ backgroundImage: `url(${backgroundImage1})` }}
        >
            <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {error && <p className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                       <PropertiesCard 
                           properties={properties} 
                           onAddProperty={handleAddProperty}
                           onSelectProperty={setSelectedProperty}
                           selectedProperty={selectedProperty}
                       />
                       <Link to="/relatorios" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                           Ver Relatórios
                       </Link>
                    </div>

                    <div className="md:col-span-1 lg:col-span-2 space-y-6">
                        <ProfileCard userName={userName} userEmail={userEmail} />
                        <AreasCard 
                            areas={areas} 
                            selectedProperty={selectedProperty} 
                            onAddArea={handleAddArea}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;