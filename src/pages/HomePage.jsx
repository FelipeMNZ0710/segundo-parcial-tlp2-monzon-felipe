import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";

export const HomePage = () => {
  // TODO: Implementar useState para almacenar la lista de superhéroes
  const [superheroes, setSuperheroes] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Integrar lógica para obtener superhéroes desde la API
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const profileResponse = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });
        if (!profileResponse.ok) {
          throw new Error("Error al obtener los datos del usuario.");
        }
        const profileData = await profileResponse.json();
        setUserName(profileData.user.name);
        const heroesResponse = await fetch("http://localhost:3000/api/superheroes", {
          credentials: "include",
        });
        if (!heroesResponse.ok) {
          throw new Error("Error al cargar la galería de superhéroes.");
        }
        const heroesData = await heroesResponse.json();
        setSuperheroes(heroesData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const handleReload = async () => {
    setReloading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/superheroes", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("No se pudo recargar la galería.");
      }
      const data = await response.json();
      setSuperheroes(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setReloading(false);
    }
  };

  if (loading) {
    return <Loading />;
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-colors disabled:bg-blue-400"
        >
          {reloading ? "Recargando..." : "Recargar"}
        </button>
      </div>

      {error && (
        <div className="text-center text-red-600 p-4">
          <p>Error: {error}</p>
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