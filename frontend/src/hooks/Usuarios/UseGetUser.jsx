import { useState } from "react";
import { getUser } from "../../services/user.service.js";

export const useGetUser = (usersData, setUserData) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUser();
            console.log(" Respuesta completa de getUser:", response);
            

            if (response && response.status === 'Success') {
           
                const users = response.data?.data || [];
                console.log(" Usuarios encontrados:", users);
                console.log(" Total de usuarios:", response.data?.length || 0);
                setUserData(users);
                return users;
            } else {
                console.warn(" No se encontraron usuarios o respuesta inválida");
                setUserData([]);
                return [];
            }
        } catch (err) {
            console.error(" Error en fetchUsers:", err);
            setError(err.message || "Error al obtener los usuarios");
            setUserData([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return [usersData, fetchUsers, loading, error];
};

export default useGetUser;