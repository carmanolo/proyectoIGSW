import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ Cargar usuario al iniciar
    useEffect(() => {
        const userData = sessionStorage.getItem('usuario');
        const token = sessionStorage.getItem('token');
        
        console.log('🔍 AuthContext: Cargando usuario...');
        console.log('📝 userData:', userData);
        console.log('📝 token:', token);
        
        if (userData && token) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
                console.log('✅ Usuario autenticado:', parsedUser);
            } catch (error) {
                console.error('❌ Error al parsear usuario:', error);
                sessionStorage.removeItem('usuario');
                sessionStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            }
        } else {
            console.log('⚠️ No hay token o usuario en sessionStorage');
            setIsAuthenticated(false);
            setUser(null);
        }
        setLoading(false);
    }, []);

    // ✅ Redirigir según autenticación
    useEffect(() => {
        if (!loading) {
            const currentPath = window.location.pathname;
            console.log('🔍 AuthContext: Verificando autenticación...');
            console.log('📝 isAuthenticated:', isAuthenticated);
            console.log('📝 currentPath:', currentPath);
            console.log('📝 user:', user);
            
            // Si no está autenticado y no está en la página de login o registro
            if (!isAuthenticated && currentPath !== '/auth' && currentPath !== '/registro') {
                console.log('🔴 Redirigiendo a /auth');
                navigate('/auth');
            }
            
            // Si está autenticado y está en la página de login, redirigir al home
            if (isAuthenticated && currentPath === '/auth') {
                console.log('🟢 Usuario autenticado en login, redirigiendo a /home');
                navigate('/home');
            }
        }
    }, [isAuthenticated, navigate, loading, user]);

    const logout = () => {
        console.log(' Cerrando sesión...');
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/auth');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        logout,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}