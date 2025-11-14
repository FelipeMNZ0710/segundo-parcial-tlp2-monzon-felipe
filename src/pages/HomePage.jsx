import { useState, useEffect } from 'react';
import Loading from '../components/Loading';

export const HomePage = () => {
  // TODO: Integrar lógica para obtener superhéroes desde la API
  const [userName, setUserName] = useState('');
  // TODO: Implementar useState para almacenar la lista de superhéroes
  const [superheroes, setSuperheroes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setError(null);
    setLoading(true);
    try {
      const [profileRes, superheroesRes] = await Promise.all([
        fetch('http://localhost:3000/api/profile', { credentials: 'include' }),
        fetch('http://localhost:3000/api/superheroes', { credentials: 'include' })
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserName(profileData.user.name);
      } else {
        throw new Error('No se pudo obtener la información del usuario.');
      }

      if (superheroesRes.ok) {
        const superheroesData = await superheroesRes.json();
        setSuperheroes(superheroesData.data);
      } else {
        throw new Error('No se pudo cargar la galería de superhéroes.');
      }
    } catch (err) {
      console.error("Error al cargar los datos iniciales:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  //TODO: Implementar función para recargar superhéroes
  const handleReload = async () => {
    setError(null);
    setReloading(true);
    try {
      const response = await fetch('http://localhost:3000/api/superheroes', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSuperheroes(data.data);
      } else {
        throw new Error('No se pudo recargar la galería.');
      }
    } catch (err) {
      console.error("Error al recargar superhéroes:", err);
      setError(err.message);
    } finally {
      setReloading(false);
    }
  };

  if (loading) {
    return <Loading/>;
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <h1 className="text-4xl font-bold text-center mt-8 mb-4 text-gray-800">
        ¡Bienvenido/a, {userName}!
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleReload}
          disabled={reloading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {reloading ? 'Recargando...' : 'Recargar'}
        </button>
      </div>
      {error && (
        <div className="text-center bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {!error && superheroes.length === 0 && (
         <div className="text-center text-gray-500 p-4">
          <p>No se encontraron superhéroes para mostrar.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {superheroes.map((hero) => (
          <div
            key={hero.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <img
              src={hero.image}
              alt={hero.superhero}
              className="h-64 object-cover w-full"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {hero.superhero}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};