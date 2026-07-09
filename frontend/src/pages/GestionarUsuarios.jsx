import { useEffect, useState } from "react";
import { useGetUser } from "@hooks/Usuarios/useGetUser.jsx";
import useCreateUser from "@hooks/Usuarios/useCreateUser.jsx";
import useEditUser from "@hooks/Usuarios/useEditUser.jsx";
import useDeleteUser from "@hooks/Usuarios/useDeleteUser.jsx";

const Users = () => {
    const [usersData, setUsersData] = useState([]);
    const [users, fetchUsers, loading, error] = useGetUser(usersData, setUsersData);
    const { handleCreateUser } = useCreateUser(fetchUsers);
    const { handleEditUser } = useEditUser(fetchUsers);
    const { handleDeleteUser } = useDeleteUser(fetchUsers);
    const [buscar, setBuscar] = useState("");

    useEffect(() => {
        if (typeof fetchUsers === 'function') {
            fetchUsers();
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si hay
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 text-red-700 p-6 rounded-xl border border-red-200 max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-2"> Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchUsers}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const limpiarFiltros = () => {
        setBuscar("");
    };

    return (
        <div className="Plan-page p-4">
            <div className="flex items-center gap-4 mb-4">
                <button 
                    className="btn btn-primary" 
                    onClick={() => handleCreateUser()}
                >
                    Crear Usuario
                </button>
                
                {buscar && (
                    <button className="btn btn-ghost" onClick={limpiarFiltros}>
                        Limpiar Filtros
                    </button>
                )}
                
                <span className="text-sm text-gray-500">
                    {users?.length || 0} usuarios encontrados
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Clases</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8">
                                    <div className="text-gray-500">
                                        <p className="text-4xl mb-2">📭</p>
                                        <p>No hay usuarios registrados</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users?.map((user) => (
                                
                                <tr key={user.id || user.id_usuario || `user-${Math.random()}`}>
                                    <td>{user.id}</td>
                                    <td className="font-medium">{user.nombre}</td>
                                    <td>{user.rut || 'N/A'}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${
                                            user.rol === 'secretario' ? 'badge-info' :
                                            user.rol === 'estudiante' ? 'badge-warning' :
                                            user.rol === 'profesor' ? 'badge-primary' :
                                            user.rol === 'ADMINISTRADOR' ? 'badge-error' :
                                            'badge-ghost'
                                        }`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td>{user.clases_disponibles || 0}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-info"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-xs btn-error"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;