"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createClaseSer,getClaseSer, getClasesSer, updateClaseSer, deleteClaseSer } from "../services/clase.service.js";
import { CLASE_NO_ENCONTRADA} from "../constants/clase.constants.js";
import { assignationValidation, integrityValidation, updateValidation } from "../validations/clase.validation.js";
export async function createClase(req, res) {
    try {
        let newClase = null;
        if(!req.body || !req.params){
            console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { tipo, descripcion, hora_inicio, hora_fin, dia } = req.body;
        console.log(hora_inicio);

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "faltan parametros",error.message);
        }


        if(newClase = await createClaseSer( tipo, descripcion, hora_inicio, hora_fin, dia)){
            return res.status(201).json({ message: "Clase registrado exitosamente",data:newClase});
        }else{
            return res.status(500).json({message: "Error al registrar Clase"})
        }
    } catch (error) {
        console.error("error en registro de usuario", error);
        return res.status(500).json({ message: "Error al registar la clase"});
    }
}

export async function getClases(req, res) {
    const claseData = await getClasesSer()
    //console.log(horarioData);
    if(!claseData){
        return handleErrorClient(res, 400, "Clases no encontrados");
    }
    //enviar informacion de horarios de hoarios encontrados
    return handleSuccess(res, 200, "clases obtenidas exitosamente", claseData);
}

export async function patchClase(req, res) {
    try {
        if (!req || !req.params || !req.body) {
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "El ID de la clase es obligatorio" });
        }

        if(req.body.tipo) {
            req.body.tipo = String(req.body.tipo).toLowerCase().trim()
        }

        if (req.body.tipo === "tipo" || req.body.tipo === "tipo") {
            return res.status(400).json({ message: "Debe seleccionar un solo tipo"});
        }

        if(req.body.dia) {
            req.body.dia = String(req.body.dia).toLowerCase().trim()
        }

        if (req.body.dia === "día" || req.body.dia === "dia") {
            return res.status(400).json({ message: "Debe seleccionar un día de la semana"});
        }

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =updateValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "falto actualizar parametros",error.message);
        }

        const claseUpdate = await getClaseSer(id);

        if(!claseUpdate){
            return handleErrorClient(res, 404, "Clase no encontrado");
        }

        Object.assign(claseUpdate, req.body);

        const updatedClase = await updateClaseSer(claseUpdate)
        if(!(updatedClase.data)){
            if(!updatedClase.error){
                return handleErrorClient(res, 500, updatedClase.message);
            }
            return handleErrorClient(res, 400, updatedClase.message);
        }
        return handleSuccess(res, 200, "Clase actualizada con éxito", updatedClase.data);

    } catch (error) {
        return handleErrorServer(res, 500, "error interno del servidor")
    }
    
}

export async function deleteClase(req, res) {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "El ID de la clase es obligatorio"});
        }

        const result = await deleteClaseSer(id);
        if(result && result.result && result.result.affected >=1){
            return handleSuccess(res, 200, "Clase eliminado exitosamente")
        }

        if (result.message === CLASE_NO_ENCONTRADA) {
            return handleErrorClient(res, 404, result.message, result.result);
        }

        return handleErrorClient(res, 400, result.message, result.result);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al eliminar la clase", error.message);
    }
}

