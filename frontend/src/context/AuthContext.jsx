import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = sessionStorage.getItem('usuario');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error al parsear usuario:', error);
                sessionStorage.removeItem('usuario');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, []);


    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate, loading]);


    const logout = () => {
   
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