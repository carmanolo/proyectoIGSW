import { createClaseService } from "@services/clase.service.js";
import Swal from "sweetalert2";
import { createSwalField } from "../utils/swalField.jsx";
import { gebi } from "../utils/getElementById.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { DIAS_SEMANA, TIPO_CLASE } from "../../constants/clase.constants.jsx";
//import { initPikadayInSwal } from "../utils/pikadayInSwal.jsx";


async function CreateClase() {

  const { value: formValues } = await Swal.fire({
    title: "Crear Nueva Clase",
    html: `
        ${StaticDropdownList(TIPO_CLASE, "Tipo", "swal2-input1", "m-1", true)}
        ${createSwalField(2, "Descripción", "")}
        ${createSwalField(3, "fecha", "", "date")} 
        ${createSwalField(4, "Hora de Inicio", "")}
        ${createSwalField(5, "Hora de Término", "")}
        ${StaticDropdownList(DIAS_SEMANA, "Día", "swal2-input6", "m-1", true)}

    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Crear",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      
        const tipo = String(gebi('swal2-input1')?.value);
        const descripcion = String(gebi('swal2-input2')?.value);
        const fecha_clase = gebi('swal2-input3')?.value;
        const hora_inicio = gebi('swal2-input4')?.value;
        const hora_fin = gebi('swal2-input5')?.value;
        const dia = String(gebi('swal2-input6')?.value);

      return {tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia};
    },
    theme: "light",
  });
  if (formValues) {
    return formValues;
  }
}

export const useCreateClase = (fetchClases) => {
    const handleCreateClase = async () => {
        let response = null;
        try {
            const formValues = await CreateClase();
            if(!formValues) return;
            response = await createClaseService(formValues);
            if (typeof(fetchClases) === "function") {
                fetchClases();
            }
            console.log(response);
        } catch (error) {
            console.error(error);
            response = error?.response || {status: 500, message: "Error desconocido"};
        }
        fireDynamicSwal(response.status, null, response?.data?.message || response?.message);
    };

    return {
        handleCreateClase
    };
};
export default useCreateClase;