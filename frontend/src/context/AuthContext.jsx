import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const isAuthenticated = user ? true : false;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            { children }
        </AuthContext.Provider>
    )
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