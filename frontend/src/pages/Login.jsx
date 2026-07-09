import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import useLogin from '@hooks/useLogin.jsx';
import { Eye, EyeOff } from 'lucide-react';
import logoConduce from '@assets/logoConduce.png';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            if (!value) {
                error = 'El correo electrónico es requerido';
            } else if (value.length < 8) {
                error = 'El correo debe tener al menos 8 caracteres';
            } else if (value.length > 30) {
                error = 'El correo no puede tener más de 30 caracteres';
            } else if (!value.endsWith('@gmail.com')) {
                error = 'El correo debe terminar en @gmail.com';
            }
        }

        if (name === 'password') {
            if (!value) {
                error = 'La contraseña es requerida';
            } else if (value.length > 26) {
                error = 'La contraseña no puede tener más de 26 caracteres';
            } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                error = 'Debe contener solo letras y números';
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        handleInputChange(name, value);
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            setIsLoading(false);
            return;
        }

        try {
            console.log('Intentando login con:', formData.email);
            const response = await login(formData);
            console.log(' Login response:', response);
            
            if (response.status === 'Success') {
                console.log(' Login exitoso, redirigiendo a /home');
                const user = sessionStorage.getItem('usuario');
                console.log(' Usuario guardado en sessionStorage:', user);
                navigate('/home');
            } else if (response.status === 'Client error') {
                errorData(response.details);
                console.log(' Error en login:', response.details);
            }
        } catch (error) {
            console.log(' Error en login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Panel izquierdo - Bienvenida */}
            <div 
                className="hidden md:flex flex-1 flex-col justify-center pl-16 pr-12 relative overflow-hidden bg-[#0d1b3e]"
            >
                <div className="absolute -right-40 -top-32 w-96 h-96 bg-white bg-opacity-5 rounded-full"></div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white bg-opacity-5 rounded-full"></div>

                <div className="w-full flex justify-center mb-12 z-10">
                    <div className="relative w-56 h-56 rounded-full border-4 border-dashed border-gray-400 flex flex-col items-center justify-center bg-[#15234b]">
                        <span className="text-white text-xs font-bold mb-4 tracking-widest">SURCENTRAL</span>
                        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center mb-2 relative">
                            <div className="absolute w-full h-0.5 bg-white"></div>
                            <div className="absolute h-full w-0.5 bg-white"></div>
                            <div className="w-6 h-6 bg-yellow-500 rounded-full z-10"></div>
                        </div>
                        <div className="absolute top-8 right-8 bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-gray-900 font-bold">✓</span>
                        </div>
                        <div className="absolute bottom-6 flex space-x-2">
                            <div className="w-4 h-1 bg-yellow-500"></div>
                            <div className="w-4 h-1 bg-yellow-500"></div>
                            <div className="w-4 h-1 bg-yellow-500"></div>
                            <div className="w-4 h-1 bg-yellow-500"></div>
                        </div>
                    </div>
                </div>

                <div className="text-white max-w-md z-10">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        Formando<br/>conductores con<br/><span className="text-blue-300">responsabilidad</span>
                    </h1>
                    <p className="text-gray-300 text-sm leading-relaxed mb-8">
                        Escuela de conducción profesional Surcentral. Aprende con
                        instructores calificados y vehículos modernos para obtener
                        tu licencia con total confianza y seguridad.

                    </p>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="flex-1 bg-white flex items-center justify-center p-12 relative">
                <div className="absolute top-20 right-20 w-32 h-32 bg-gray-50 rounded-full opacity-60"></div>
                <div className="absolute bottom-32 left-20 w-24 h-24 bg-gray-50 rounded-full opacity-40"></div>

                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Bienvenido de nuevo</h2>
                        <p className="text-gray-500 text-sm">
                            Ingresa tus credenciales para continuar
                        </p>

                    </div>

                    <form onSubmit={loginSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2 text-left">Correo electrónico</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ejemplo@gmail.com"
                                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none transition-colors placeholder-gray-400 ${errors.email || errorEmail
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                    }`}
                                autoComplete="email"
                                required
                            />
                            {(errors.email || errorEmail) && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email || errorEmail}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2 text-left mt-2">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu contraseña"
                                    className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none transition-colors placeholder-gray-400 pr-12 ${errors.password || errorPassword
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {(errors.password || errorPassword) && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.password || errorPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 mt-4 rounded-lg font-bold transition-all duration-200 text-white shadow-md hover:shadow-lg ${isLoading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    INICIANDO...
                                </div>
                            ) : (
                                'INICIAR SESIÓN'
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link 
                                to="/registro" 
                                className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                            >
                                Preinscríbete aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
