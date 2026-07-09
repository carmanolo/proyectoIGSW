import Swal from "sweetalert2";
import { CreateUser } from "../../services/user.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { createSwalField } from "../utils/swalField.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { VALID_ROLES } from "../../constants/users.constants.jsx";

async function CreateUsers() {
  const { value: formValues } = await Swal.fire({
    title: "Crear Nuevo Usuario",
    html: `
      ${createSwalField(1, "Nombre del Usuario", "")}
      ${createSwalField(2, "RUT", "")}
      ${createSwalField(3, "Email", "", "email")}
      ${createSwalField(4, "Contraseña (mínimo 8 caracteres)", "", "password")}
      ${StaticDropdownList(VALID_ROLES, "Rol", "swal2-input5", "m-1", true)}
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear Usuario",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombre = String(gebi("swal2-input1")?.value || "").trim();
      const rut = String(gebi("swal2-input2")?.value || "").trim();
      const email = String(gebi("swal2-input3")?.value || "").trim();
      const password = String(gebi("swal2-input4")?.value || "");
      const rol = String(gebi("swal2-input5")?.value || "").toLowerCase();

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
      if (!password) {
        Swal.showValidationMessage("La contraseña es obligatoria");
        return false;
      }
      if (password.length < 8) {
        Swal.showValidationMessage("La contraseña debe tener al menos 8 caracteres");
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
      return {  nombre, rut, email, password, rol };
    },
    theme: "light",
  });

  if (formValues) {
    return formValues;
  }
}

export const useCreateUser = (fetchUsers) => {
  const handleCreateUser = async () => {
    let response = null;
    try {
      const formValues = await CreateUsers();
      if (!formValues) return;
      
      console.log(' Datos a enviar al backend:', formValues);
      
      response = await CreateUser(formValues);
      console.log(' Respuesta del backend:', response);
      
      if (typeof fetchUsers === "function") {
        fetchUsers();
      }
    } catch (error) {
      console.error(' Error en handleCreateUser:', error);
      console.error(' Detalles del error:', error.response?.data);
      response = error?.response || { status: 500, message: "Error desconocido" };
    }
    fireDynamicSwal(response.status, null, response?.message || response?.data?.message || "Usuario creado exitosamente");
  };

  return {
    handleCreateUser,
  };
};

export default useCreateUser;