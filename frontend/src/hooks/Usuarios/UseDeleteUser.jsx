import Swal from "sweetalert2";
import { DeleteUser } from "../../services/user.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";

export const useDeleteUser = (fetchUsers) => {
  const handleDeleteUser = async (id_user, nombreUser) => {
    const result = await Swal.fire({
      title: "¿Eliminar Usuario?",
      text: `¿Estás seguro de eliminar el usuario "${nombreUser}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    let response = null;
    try {
      response = await DeleteUser(id_user);
      console.log(' Respuesta de DeleteUser:', response);

      if (response && response.status === 'Success') {
        await fireDynamicSwal(200, null, response.message || "Usuario eliminado exitosamente");
      } else {
        await fireDynamicSwal(response?.status || 400, null, response?.message || "Error al eliminar usuario");
      }
      
      if (typeof fetchUsers === "function") {
        fetchUsers();
      }
    } catch (error) {
      console.error(' Error en handleDeleteUser:', error);
      console.error(' Detalles del error:', error.response?.data);
      
      const errorMsg = error.message || error.response?.data?.message || "Error desconocido";
      await fireDynamicSwal(400, null, errorMsg);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
  };

  return {
    handleDeleteUser,
  };
};

export default useDeleteUser;