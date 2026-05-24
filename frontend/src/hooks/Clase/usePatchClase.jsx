import { patchClaseService } from "@services/clase.service.js";
import Swal from "sweetalert2";
import { createSwalField } from "../utils/swalField.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { DIAS_SEMANA,TIPO_CLASE } from "../../constants/clase.constants.jsx";

async function editClaseInfo(clase) {
    console.log(JSON.stringify(clase));
    const { value: formValues } = await Swal.fire({
        title: 'Editar clase',
        html: `
            ${StaticDropdownList(TIPO_CLASE, clase.tipo, "swal2-input1", "m-1", false)}
            ${createSwalField(2, "Descripcion", clase.descripcion)}
            ${createSwalField(3, "fecha", clase.fecha_clase, "date")} 
            ${createSwalField(4, "Hora de Inicio", clase.hora_inicio)}
            ${createSwalField(5, "Hora de Término", clase.hora_fin)}
            ${StaticDropdownList(DIAS_SEMANA, clase.dia, "swal2-input6", "m-1", false)}
            `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {
            
            const tipo = document.getElementById('swal2-input1').value;
            const descripcion = document.getElementById('swal2-input2').value;
            const fecha_clase = document.getElementById('swal2-input2').value;
            const hora_inicio = document.getElementById('swal2-input4').value;
            const hora_fin = document.getElementById('swal2-input5').value;
            const dia = document.getElementById('swal2-input6').value;

            if(!tipo || !descripcion || ! fecha_clase || !hora_inicio || !hora_fin || !dia){
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }
            return { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia };

        },
        theme: "light",
    });
    if (formValues) {
        return {
            tipo: formValues.tipo,
            descripcion: formValues.descripcion,
            fecha: formValues.fecha,
            hora_inicio: formValues.hora_inicio,
            hora_fin: formValues.hora_fin,
            sala: formValues.sala,
            dia: formValues.dia,
        };     
    }
}

export const editClase=(fetchClase)=> {
    const handleEditClase = async (id_clase,clase) => {
        try {
            const formValues= await editClaseInfo(clase);
            if(!formValues) return;

            const response = await patchClaseService(id_clase, formValues);
            if(response){
                fireDynamicSwal(response?.status, null, response.message || response.details || response.data?.message || response.data?.details);
                await fetchClase();
            }
        }
         catch (error) {
            // console.error('Error al actualizar el clase:', error);
        }
    };
    return { handleEditClase };
};

export default editClase;
