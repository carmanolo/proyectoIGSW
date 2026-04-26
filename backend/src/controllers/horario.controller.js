"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createHorarioSer, getHorarioSer, getHorariosSer, updateHorarioSer, deleteHorarioSer } from "../services/horario.service.js";
import { HORARIO_NO_ENCONTRADO } from "../constants/horario.constants.js";
import { assignationValidation, integrityValidation, updateValidation } from "../validations/horario.validation.js";
export async function asignarHorario(req, res) {
    try {
        let newHorario = null;
        if(!req.body || !req.params){
            console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { hora_inicio, hora_fin, dia } = req.body;
        console.log(hora_inicio);

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "faltan parametros",error.message);
        }


        if(newHorario = await createHorarioSer( hora_inicio, hora_fin, dia)){
            return res.status(201).json({ message: "Horario registrado exitosamente",data:newHorario});
        }else{
            return res.status(500).json({message: "Error al registrar horario"})
        }
    } catch (error) {
        console.error("error en registro de usuario", error);
        return res.status(500).json({ message: "Error al registar el hoario"});
    }
}

export async function getHorarios(req, res) {
    const horarioData = await getHorariosSer();
    //console.log(horarioData);
    if(!horarioData){
        return handleErrorClient(res, 400, "Horarios no encontrados");
    }
    //enviar informacion de horarios de hoarios encontrados
    return handleSuccess(res, 200, "horarios obtenidos exitosamente", horarioData);
}

export async function patchHorario(req, res) {
    try {
        if (!req || !req.params || !req.body) {
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "El ID del horario es obligatorio" });
        }

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =updateValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "falto actualizar parametros",error.message);
        }

        const horarioUpdate = await getHorarioSer(id);

        if(!horarioUpdate){
            return handleErrorClient(res, 404, "Horario no encontrado");
        }

        const updatedHorario = await updateHorarioSer(horarioUpdate);
        if(!(updatedHorario.data)){
            if(!updatedHorario.error){
                return handleErrorClient(res, 500, updatedHorario.message);
            }
            return handleErrorClient(res, 400, updatedHorario.message);
        }
        return handleSuccess(res, 200, "Horario actualizado con éxito", updatedHorario.data);

    } catch (error) {
        return handleErrorServer(res, 500, "error interno del servidor")
    }
    
}

export async function deleteHorario(req, res) {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "El ID del horario es obligatorio"});
        }

        const result = await deleteHorarioSer(id);
        if(result && result.result && result.result.affected >=1){
            return handleSuccess(res, 200, "Horario eliminado exitosamente")
        }

        if (result.message === HORARIO_NO_ENCONTRADO) {
            return handleErrorClient(res, 404, result.message, result.result);
        }

        return handleErrorClient(res, 400, result.message, result.result);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al eliminar el horario", error.message);
    }
}

