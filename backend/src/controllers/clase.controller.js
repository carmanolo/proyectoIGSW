"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { editarAsignacionLoteSer, createClaseSer,getClaseSer, getClasesSer, updateClaseSer, deleteClaseSer, asignarPorLoteService, getClasesConUsuarioSer } from "../services/clase.service.js";
import { CLASE_NO_ENCONTRADA} from "../constants/clase.constants.js";
import { assignationValidation, integrityValidation, updateValidation, validacionHoraIntegridad, validateHoraNegocio} from "../validations/clase.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { SHOW_ERRORS } from "../constants/settings.constants.js";

const timeValidationHelper = (hora_inicio, hora_termino) => {
  let result = validacionHoraIntegridad(hora_inicio);
  if (result) {
    return String(result);
  }
  result = validacionHoraIntegridad(hora_termino);
  if (result) {
    return String(result);
  }
  result = validateHoraNegocio(hora_inicio, hora_termino);
  if (result) {
    return String(result);
  }
  return null;
} 

export async function createClase(req, res) {
    try {
        let newClase = null;
        if(!req.body || !req.params){
            console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }
        
        const { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia } = req.body;
        console.log(hora_inicio);

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "faltan parametros", result.error.message);
        }

        let validationTime = timeValidationHelper(req.body.hora_inicio, req.body.hora_fin);
         if (validationTime) {
            return res.status(400).json({ message: String(validationTime) });
        } 

        if(newClase = await createClaseSer( tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia)){
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

        let validatedId = idValidation.validate({id: id});
        if (validatedId.error) {
            if (SHOW_ERRORS) {
                console.error(validatedId?.error?.cause || JSON.stringify(validatedId?.error));
            }
            return res.status(400).json({ message: validatedId.error.message });
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
            return handleErrorClient(res, 400, "falto actualizar parametros", result.error.message);
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
        return handleErrorServer(res, 500, "error interno del servidor", error.message, error)
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
        return handleErrorServer(res, 500, "Error al eliminar la clase", error.message, error);
    }
}

export async function asignarPorLote(req, res){
    try {
        const result = await asignarPorLoteService();

        if(result.error){
            return handleErrorClient(res, 400, result.message)
        }

        return handleSuccess(res, 200, "asignación completada", result.data);
    } catch (error) {
        return handleErrorServer(res, 500, "Error interno del servidor", error.message, error);
    }
}

export async function editarAsignacionPorLote(req, res) {
    try {
        const id = req?.params?.id || null;
        const validatedId = idValidation.validate({ id });
        if (validatedId.error) {
            return handleErrorClient(res, 400, validatedId.error.message);
        }

        const result = await editarAsignacionLoteSer(id);

        if (result.error) {
            return handleErrorClient(res, 404, "usuarios inexistentes");
        }

        return handleSuccess(res, 200, "usuarios actualizados exitosamente", result.data);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor", error.message, error);
    }
}

export async function getClasesConUsuarios(req, res) {
  try {
    const result = await getClasesConUsuarioSer();

    if (result.error) {
      return handleErrorClient(res, 404, "error de cliente");
    }

    return handleSuccess(res, 200, "usuarios obtenidos con éxito", result.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message, error);
  }
}

