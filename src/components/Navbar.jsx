import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onLogout }) => {
  const [userName, setUserName] = useState("Usuario");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/profile', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name); 
        } else {
          console.error("No se pudo obtener el perfil del usuario.");
          onLogout();
        }
      } catch (error) {
        console.error("Error de red al obtener el perfil:", error);
        onLogout();
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        onLogout();
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Error al cerrar sesión: ${errorData.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error de red durante el logout:', error);
      alert('Error de conexión. No se pudo cerrar la sesión.');
    }
  };

  return (
    <nav className="bg-gray-900 text-white h-16 left-0 right-0 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-2xl font-bold">Superhéroes App</div>

        <div className="hidden md:flex items-center space-x-6">
          <span className="text-gray-300">
            Bienvenido,{" "}
            <span className="font-semibold text-white">{userName}</span>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};