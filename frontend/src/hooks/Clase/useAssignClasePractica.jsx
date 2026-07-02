import { useState, useCallback } from "react";
import { asignarUsuarioClasePracticaService } from "../../services/clase.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import Swal from "sweetalert2";

export function useAsignarClasePractica(){
    const [loading, setLoading] = useState(false);

    // const asignarUsuarioIndividual = useCallback(async (id_clase, studentList = []) =>{
    const asignarUsuarioIndividual = useCallback(async (id_clase, studentList) =>{
        if(!id_clase){
            console.error("id de clase es requerido para asignar un alumno");
            return;
        }

        console.log(studentList);
        console.log("¿Es la lista de estudiantes un arreglo?: ", Array.isArray(studentList));

        if(!Array.isArray(studentList) || studentList.length === 0){
            await fireDynamicSwal(404, "Sin estudiantes", "No hay estudiantes disponibles");
            return;
        }

        const opcionesDataList = studentList
            .map((u)=> {
                console.log(u);
                return `<option value="${String(u).split(". ")[1]}"></option>`;
            })
            .join("");

        console.log(opcionesDataList);
        const HTML_COMPLETO = `
                <input
                    id = "input-buscar-alumno"
                    list="lista-alumnos"
                    class="swal2-input"
                    placeholder="Escribe el nombre del alumno"
                    autocomplete="off"
                >
                <datalist id="lista-alumnos">${opcionesDataList}</datalist>
                </input>
            `;
        console.log(HTML_COMPLETO);

        const result = await Swal.fire({
            title: "¿Asignar alumno a esta clase practica?",
            html: HTML_COMPLETO,
            icon: "question",
            showCancelButton: true,
            confirmButtonText:"asignar",
            cancelButtonText:"Cancelar",
            theme: "light",
            preConfirm: () =>{
                const valor = document.getElementById("input-buscar-alumno")?.value?.trim();
                const estudiante = studentList.find(
                    (u) => String(u).split(". ")[1] === valor
                );

                console.log("ESTUDIANTE ENCONTRADO: ", estudiante);

                if(!estudiante){
                    Swal.showValidationMessage("Selecciona un alumno valido de la lista");
                    return false;
                }

                return Number(String(estudiante).split(". ")[0].trim());
            },
        });

        if(!result.isConfirmed) return;

        const id_usuario = result.value;
        setLoading(true);

        try {
            const response = await asignarUsuarioClasePracticaService(id_clase, id_usuario);
            await fireDynamicSwal(response?.status, null, response?.message);
            return response;
        } catch (error) {
            console.error(error);
            const errorResponse = error?.response || { status: 500, message: "Error al asignar el alumno" };
            await fireDynamicSwal(errorResponse?.status, null, errorResponse?.message);
            return errorResponse;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        asignarUsuarioIndividual,
    };
}

