import Swal from "sweetalert2";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { UpdateUser } from "../../services/user.service.js";
import { VALID_ROLES } from "../../constants/users.constants.jsx";

async function EditUserModal(user) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
      ${createSwalField(1, "Nombre del Usuario", user.nombre || '')}
      ${createSwalField(2, "RUT", user.rut || '')}
      ${createSwalField(3, "Email", user.email || '')}
      ${StaticDropdownList(VALID_ROLES, user.rol || "Rol", "swal2-input5", "m-1", true)}
      <div class="mt-3 text-sm text-gray-500">
        <p> Deja la contraseña vacía si no quieres cambiarla</p>
        ${createSwalField(4, "Nueva Contraseña (opcional)", "", "password")}
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Actualizar Usuario",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = String(gebi("swal2-input1")?.value || "").trim();
      const rut = String(gebi("swal2-input2")?.value || "").trim();
      const email = String(gebi("swal2-input3")?.value || "").trim();
      const rol = String(gebi("swal2-input5")?.value || "").toLowerCase();
      const password = String(gebi("swal2-input4")?.value || "");

      if (!nombre) {
        Swal.showValidationMessage("El nombre es obligatorio");
        return false;
      }
      if (!rut) {
        Swal.showValidationMessage("El RUT es obligatorio");
        return false;
      }
      if (!email) {
        Swal.showValidationMessage("El email es obligatorio");
        return false;
      }
      if (!email.includes('@') || !email.includes('.')) {
        Swal.showValidationMessage("Email inválido");
        return false;
      }
      if (!rol) {
        Swal.showValidationMessage("El rol es obligatorio");
        return false;
      }
      if (!VALID_ROLES.includes(rol)) {
        Swal.showValidationMessage(`Rol inválido. Debe ser: ${VALID_ROLES.join(', ')}`);
        return false;
      }
      const dataToSend = { nombre, rut, email, rol };

      if (password && password.length > 0) {
        if (password.length < 8) {
          Swal.showValidationMessage("La contraseña debe tener al menos 8 caracteres");
          return false;
        }
        dataToSend.password = password;
      }

      return dataToSend;
    },
    theme: "light",
  });

  if (formValues) {
    return formValues;
  }
}

export const useEditUser = (fetchUsers) => {
  const handleEditUser = async (user) => {
    let response = null;
    try {
      const formValues = await EditUserModal(user);
      if (!formValues) return;
      
      console.log(' Datos a enviar al backend:', formValues);
      
      response = await UpdateUser(user.id, formValues);
      console.log(' Respuesta del backend:', response);
      
      if (typeof fetchUsers === "function") {
        fetchUsers();
      }
    } catch (error) {
      console.error(' Error en handleEditUser:', error);
      console.error(' Detalles del error:', error.response?.data);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
    fireDynamicSwal(response.status, null, response?.message || response?.data?.message || "Usuario actualizado exitosamente");
  };

  return {
    handleEditUser,
  };
};

export default useEditUser;