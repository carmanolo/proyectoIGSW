import { patchClaseService } from "@services/clase.service.js";
import Swal from "sweetalert2";
import { createSwalField, createSwalDateField } from "../utils/swalField.jsx";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import { StaticDropdownList } from "../utils/DropdownList.jsx";
import { DIAS_SEMANA, TIPO_CLASE, ESTADO_CLASE } from "../../constants/clase.constants.jsx";
import { getTeacherEmail, processCars, processTeachers, isFechaValida } from "../../utils/ClaseUtils.js";
import { getUserEmail } from "../../services/profile.service.js";

async function editClaseTeoricaInfo(clase, profesores, isTeacher) {
    // console.log(JSON.stringify(clase));
    const { value: formValues } = await Swal.fire({
        title: 'Editar clase',
        html: `
            ${StaticDropdownList(TIPO_CLASE, clase.tipo, "swal2-input1", "m-1", false)}
            ${createSwalField(2, "Descripcion", clase.descripcion)}
            ${createSwalDateField(3, "fecha", clase.fecha_clase)} 
            ${createSwalField(4, "Hora de Inicio", clase.hora_inicio)}
            ${createSwalField(5, "Hora de Término", clase.hora_fin)}
            ${StaticDropdownList(DIAS_SEMANA, clase.dia, "swal2-input6", "m-1", false)}
            ${StaticDropdownList(ESTADO_CLASE, clase.estado_clase, "swal2-input7", "m-1", false)}
            ${StaticDropdownList(profesores, `${clase?.teacherObject?.name} (${clase?.teacherObject?.email})`, "swal2-input8", "m-1", false, !isTeacher)}
            `,


        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {

            const tipo = document.getElementById('swal2-input1').value;
            const descripcion = document.getElementById('swal2-input2').value;
            const fecha_clase = document.getElementById('swal2-input3').value;

            // console.log("FECHA CLASE", fecha_clase);
            const hora_inicio = document.getElementById('swal2-input4').value;
            const hora_fin = document.getElementById('swal2-input5').value;
            const dia = document.getElementById('swal2-input6').value;
            const estado_clase = document.getElementById('swal2-input7').value;
            const email_profesor = getTeacherEmail(String(document.getElementById('swal2-input8')?.value || (isTeacher && getUserEmail())));
            const id_auto = null;

            if (!tipo || !descripcion || !fecha_clase || !hora_inicio || !hora_fin || !dia || !estado_clase || !email_profesor) {
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }

            if (!isFechaValida(fecha_clase)) {
                Swal.showValidationMessage('La fecha no puede ser anterior a hoy');
                return false; 
            }
            return { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor };

        },
        theme: "light",
    });
    if (formValues) {
        return {
            tipo: formValues.tipo,
            descripcion: formValues.descripcion,
            fecha_clase: formValues.fecha_clase,
            hora_inicio: formValues.hora_inicio,
            hora_fin: formValues.hora_fin,
            dia: formValues.dia,
            estado_clase: formValues.estado_clase,
            email_profesor: formValues.email_profesor,
        };
    }
}

async function editClasePracticaInfo(clase, profesores, vehiculos, isTeacher) {
    // console.log(JSON.stringify(clase));
    const { value: formValues } = await Swal.fire({
        title: 'Editar clase',
        html: `
            ${StaticDropdownList(TIPO_CLASE, clase.tipo, "swal2-input1", "m-1", false)}
            ${createSwalField(2, "Descripcion", clase.descripcion)}
            ${createSwalDateField(3, "fecha", clase.fecha_clase)} 
            ${createSwalField(4, "Hora de Inicio", clase.hora_inicio)}
            ${createSwalField(5, "Hora de Término", clase.hora_fin)}
            ${StaticDropdownList(DIAS_SEMANA, clase.dia, "swal2-input6", "m-1", false)}
            ${StaticDropdownList(ESTADO_CLASE, clase.estado_clase, "swal2-input7", "m-1", false)}
            ${StaticDropdownList(profesores, `${clase?.teacherObject?.name} (${clase?.teacherObject?.email})`, "swal2-input8", "m-1", false, !isTeacher)}
            ${StaticDropdownList(vehiculos, `${clase?.carObject?.patente}`, "swal2-input9", "m-1", false)}
            `,

        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Editar',
        preConfirm: () => {

            const tipo = document.getElementById('swal2-input1').value;
            const descripcion = document.getElementById('swal2-input2').value;
            const fecha_clase = document.getElementById('swal2-input3').value;

            // console.log("FECHA CLASE", fecha_clase);
            const hora_inicio = document.getElementById('swal2-input4').value;
            const hora_fin = document.getElementById('swal2-input5').value;
            const dia = document.getElementById('swal2-input6').value;
            const estado_clase = document.getElementById('swal2-input7').value;
            const email_profesor = getTeacherEmail(String(document.getElementById('swal2-input8')?.value || (isTeacher && getUserEmail())));
            const patente_auto = document.getElementById('swal2-input9').value;

            if (!tipo || !descripcion || !fecha_clase || !hora_inicio || !hora_fin || !dia || !estado_clase || !email_profesor || !patente_auto) {
                Swal.showValidationMessage('Por favor complete todos los campos');
                return;
            }

            if (!isFechaValida(fecha_clase)) {
                Swal.showValidationMessage('La fecha no puede ser anterior a hoy');
                return false; 
            }
            return { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, email_profesor, patente_auto };

        },
        theme: "light",
    });
    if (formValues) {
        return {
            tipo: formValues.tipo,
            descripcion: formValues.descripcion,
            fecha_clase: formValues.fecha_clase,
            hora_inicio: formValues.hora_inicio,
            hora_fin: formValues.hora_fin,
            dia: formValues.dia,
            estado_clase: formValues.estado_clase,
            email_profesor: formValues.email_profesor,
            patente_auto: formValues.patente_auto
        };
    }
}

export const editClase = (fetchClase, profesores, vehiculos, isTeacher) => {
    profesores = processTeachers(profesores);
    vehiculos = processCars(vehiculos);

    let response = null;
    const handleEditClase = async (id_clase, clase) => {
        try {

            let formValues = null;

            if (clase.tipo === "practica") {
                // console.log("Clase practica");
                formValues = await editClasePracticaInfo(clase, profesores, vehiculos, isTeacher);
            } else if (clase.tipo === "teorica") {
                // console.log("CLASE TEÓRICA");
                formValues = await editClaseTeoricaInfo(clase, profesores, isTeacher);
            } else {
                return;
            }

            if (!formValues) return;

             response = await patchClaseService(id_clase, formValues);
            if (response) {
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
