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
      response = await deleteUser(id_user);
      if (typeof fetchUsers === "function") {
        fetchUsers();
      }
    } catch (error) {
      console.error(error);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
    fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
  };

  return {
    handleDeleteUser,
  };
};

export default useDeleteUser;