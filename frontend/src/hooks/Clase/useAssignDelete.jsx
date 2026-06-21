import {useState, useCallback } from "react";
import { deleteAssignsClase } from "../../services/clase.service.js";
import { fireDynamicSwal } from "../utils/dynamicSwal.jsx";
import Swal from "sweetalert2";

export function useDeleteAsignacion(){
    const [loading , setLoading] = useState(false);

    const eliminarAsignacion = useCallback(async (id_usuario)=> {
        if(!id_usuario){
            console.error("id de usaurio es requerido para la eliminación");
            return;
        }

        const confirm = await Swal.fire({
            title: "¿Eliminar a este usuario de la clase",
            text: `Se desasignara a ${id_usuario} de todas las clases teoricas en las que este incrito`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText:"Cancelar",
            theme: "light"
        });

        if(!confirm.isConfirmed) return;

        setLoading(true);

        try {
            const response = await deleteAssignsClase(id_usuario);
            await fireDynamicSwal(response?.status, null, response?.message);
            return response;
        } catch (error) {
            console.error(error);
            const errorResponse = error?.response || { status: 500, message: "Error al eliminar la asignación" };
            await fireDynamicSwal(errorResponse?.status, null, errorResponse?.message);
            return errorResponse;
        }finally {
            setLoading(false);
        }


    }, []);

    return {loading, 
        eliminarAsignacion
    }
}