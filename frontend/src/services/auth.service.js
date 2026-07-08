import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function login(dataUser) {
    try {
        console.log('🔍 Enviando login request...');
        const response = await axios.post('/auth/login', {
            email: dataUser.email,
            password: dataUser.password
        });

        console.log('📝 Login response:', response);

        if (response.status === 200) {
            const { user, token } = response.data.data;
            
            console.log('👤 Usuario recibido:', user);
            console.log('🔑 Token recibido:', token);
            
            // ✅ GUARDAR TOKEN Y USUARIO EN SESSIONSTORAGE
            if (token) {
                sessionStorage.setItem('token', token);
                console.log('✅ Token guardado en sessionStorage');
            } else {
                console.error('❌ No se recibió token');
            }
            
            if (user) {
                sessionStorage.setItem('usuario', JSON.stringify(user));
                console.log('✅ Usuario guardado en sessionStorage');
            }
            
            // ✅ Verificar que se guardó correctamente
            const savedToken = sessionStorage.getItem('token');
            const savedUser = sessionStorage.getItem('usuario');
            console.log('📝 Token guardado:', savedToken ? '✅ SI' : '❌ NO');
            console.log('📝 Usuario guardado:', savedUser ? '✅ SI' : '❌ NO');
            
            // Guardar en cookie (para el interceptor)
            cookies.set('jwt-auth', token, { path: '/' });
            
            return response.data;
        }
    } catch (error) {
        console.error('❌ Error en login:', error);
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function register(data) {
    try {
        const { email, password } = data;
        const response = await axios.post('/auth/register', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al conectar con el servidor' };
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
