import axios from 'axios';
import cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Interceptor para agregar token
instance.interceptors.request.use(
  (config) => {
    // ✅ PRIMERO buscar en sessionStorage
    let token = sessionStorage.getItem('token');
    
    // ✅ Si no está en sessionStorage, buscar en cookies
    if (!token) {
      token = cookies.get('jwt-auth');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Request con token:', config.method.toUpperCase(), config.url);
    } else {
      console.warn('⚠️ No hay token disponible para:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor para manejar respuestas
instance.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error Response:', error.response?.status, error.response?.data);
    
    // Si es 401, redirigir al login
    if (error.response?.status === 401) {
      console.log('🔴 Token expirado o inválido, redirigiendo a login');
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('token');
      cookies.remove('jwt-auth');
      // No redirigir automáticamente, dejar que el AuthContext maneje la redirección
    }
    
    return Promise.reject(error);
  }
);

export default instance;
