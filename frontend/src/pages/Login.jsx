import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DULabelInput } from '../components/daisyui/DULabelInput';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email === 'ignacio.@gmail.com' && password === 'secre2026') {
            // Si es correcto, guardamos el usuario (opcional) y redireccionamos
            console.log("Login exitoso");
            navigate('/dashboard'); // CAMBIA '/dashboard' POR TU RUTA PROTEGIDA
        } else {
            // Si falla, mostramos un mensaje
            setError('Credenciales incorrectas');
            console.log("Login fallido");
        }
    };    return (
        <div className="min-h-screen bg-[#7aff00] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md transform transition-all hover:scale-105">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <h1 className="text-4xl font-bold text-center text-[#7aff00] mb-8">
                        Iniciar sesión
                    </h1>
                    
                    <DULabelInput label="Prueba" defaultText="hola miguel" />

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@ejemplo.com"
                            autoComplete='ignacio.@gmail.com'
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="**********"
                            autoComplete='secre2026'
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                        />
                    </div>
                    <p>{error}</p>
                    <button 
                        type="submit" 
                        className="w-full bg-[#7aff00] text-gray-900 font-bold py-3 rounded-lg hover:bg-[#6ae600] transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#7aff00]/30"
                    >
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
