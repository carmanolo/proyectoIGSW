"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createEvaluacionSer, getEvaluacionSer, getEvaluacionesSer, updateEvaluacionSer, deleteEvaluacion } from "../services/evaluacion.service.js";

export async function asignarEvaluacion(req, res) {
    try {
        let newEvaluacion = null;
        if(!req.body || req.params){
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { placa, marca } = req.body;

        if(newEvaluacion = await createEvaluacionSer(placa, marca)){
            return res.status(201).json({ message: "Evaluacion registrada exitosamente",data:newEvaluacion});
        }else{
            return res.status(500).json({message: "Error al registrar evaluacion"})
        }
    } catch (error) {
        console.error("error en registro de evaluacion", error);
        return res.status(500).json({ message: "Error al registrar la evaluacion"});
    }
}

export async function getEvaluacion(req, res) {
    const evaluacionData = await getEvaluacionesSer();
    if(!evaluacionData){
        return handleErrorClient(res, 400, "Evaluaciones no encontradas");
    }
}

export async function patchEvaluacion(req, res) {
    try {
        if (!req || !req.params || !req.body) {
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "El ID de la evaluacion es obligatorio" });
        }

        const evaluacionUpdate = await getEvaluacionSer(id);

        if(!evaluacionUpdate){
            return handleErrorClient(res, 404, "Evaluacion no encontrada");
        }

        const updatedEvaluacion = await updateEvaluacionSer(evaluacionUpdate);
        if(!(evaluacionUpdate.data)){
            if(!evaluacionUpdate.error){
                return handleErrorClient(res, 500, evaluacionUpdate.message);
            }
            return handleErrorClient(res, 400, evaluacionUpdate.message);
        }
        return handleSuccess(res, 200, "Evaluacion actualizada con éxito", evaluacionUpdate.data);

    } catch (error) {
        return handleErrorServer(res, 500, "error interno del servidor")
    }
    
}

export async function deleteEvaluacion(req, res) {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "El ID de la evaluacion es obligatorio"});
        }

        const result = await deleteEvaluacion(id);
        if(result && result.result && result.result.affected >=1){
            return handleSuccess(res, 200, "Evaluacion eliminada exitosamente")
        }

        /*if (result.message === EVALUACION_NO_ENCONTRADA) {
            return handleErrorClient(res, 404, result.message, result.result);
        }*/

        return handleErrorClient(res, 400, result.message, result.result);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al eliminar la evaluacion", error.message);
    }
}
