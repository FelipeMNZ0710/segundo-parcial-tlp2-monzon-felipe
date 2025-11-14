import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useForm from '../../hooks/useForm';

export const RegisterPage = ({ onLoginSuccess }) => {
  // TODO: Integrar lógica de registro aquí
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // TODO: Implementar useForm para el manejo del formulario
  const { values, handleChange } = useForm({
    username: '',
    email: '',
    password: '',
    name: '',
    lastname: '',
  });

  // TODO: Implementar función handleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const { username, email, password, name, lastname } = values;
    if (!username || !email || !password || !name || !lastname) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        onLoginSuccess();
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al crear la cuenta. Intenta nuevamente.');
      }
    } catch (err) {
      console.error('Error de conexión en el registro:', err);
      setError('No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Crear Cuenta
        </h2>

        {/* TODO: Mostrar este div cuando haya error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              placeholder="Elige un nombre de usuario"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Crea una contraseña segura"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="lastname"
              className="block text-gray-700 font-medium mb-2"
            >
              Apellido
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={values.lastname}
              onChange={handleChange}
              placeholder="Tu apellido"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};