"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { editarAsignacionLoteSer, createClaseSer,getClaseSer, getClasesSer, updateClaseSer, deleteClaseSer, asignarPorLoteService, getClasesConUsuarioSer, asignacionIndividualService, desasignacionIndividualService } from "../services/clase.service.js";
import { CLASE_NO_ENCONTRADA} from "../constants/clase.constants.js";
import { assignationValidation, integrityValidation, updateValidation, validacionHoraIntegridad, validateHoraNegocio} from "../validations/clase.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { SHOW_ERRORS } from "../constants/settings.constants.js";
import { findTeacherByEmail, findUserByEmail } from "../services/user.service.js";
import { obtenerVehiculoPorPatente } from "../services/vehiculo.service.js";
import { TEACHER_ROLE } from "../constants/user.constants.js";

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
            // console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }
        
        if (req?.body?.email_profesor) {
            req.body.id_profesor = ((await findTeacherByEmail(req.body.email_profesor)) || {id: 0})?.id;
            delete req.body.email_profesor;
        }
        if (req?.body?.patente_auto) {
            req.body.id_auto = ((await obtenerVehiculoPorPatente(req.body.patente_auto)) || {id: 0})?.id_auto;
            delete req.body.patente_auto;
        }

        const { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, id_auto, id_profesor } = req.body;
        // console.log(hora_inicio);

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result = assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "faltan parametros", result.error.message);
        }

        let validationTime = timeValidationHelper(req.body.hora_inicio, req.body.hora_fin);
         if (validationTime) {
            return res.status(400).json({ message: String(validationTime) });
        } 

        if(newClase = await createClaseSer( tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, id_auto, id_profesor)){
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

    const userId = req.user.id || req.user.sub;
    const userRole = req.user.rol;

    const claseData = await getClasesSer(userId, userRole)
    //// console.log(horarioData);
    if(!claseData){
        return handleErrorClient(res, 400, "Clases no encontrados");
    }

    // console.log("CLASEDATA: ", JSON.stringify(claseData));
    //enviar informacion de horarios de hoarios encontrados
    return handleSuccess(res, 200, "clases obtenidas exitosamente", claseData);
}

export async function patchClase(req, res) {
    let vehiculoEncontrado = null;

    try {
        if (!req || !req.params || !req.body) {
            if (SHOW_ERRORS) {
                // console.log("REQ: ", req);
                // console.log("REQ PARAMS: ", req?.params || undefined);
                // console.log("REQ BODY: ", req?.body || undefined);
            }
            return res.status(400).json({message: "Datos no proporcionados"});
        }
        if (req?.body?.email_profesor) {
            req.body.id_profesor = ((await findTeacherByEmail(req.body.email_profesor)) || {id: 0})?.id;
            delete req.body.email_profesor;
        }
        if (req?.body?.patente_auto) {
            vehiculoEncontrado = ((await obtenerVehiculoPorPatente(req.body.patente_auto)) || {id: 0});
            req.body.id_auto = vehiculoEncontrado.id_auto;
            delete req.body.patente_auto;
        }

        const { id } = req.params;
        if(!id){
            if (SHOW_ERRORS) {
                // console.log("NO HAY ID XDDDD");
                // console.log("REQ PARAMS: ", req?.params || undefined);
            }
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

        if (req.body.tipo === "tipo") {
            if (SHOW_ERRORS) {
                // console.log("TIPO: ", req.body.tipo);
            }
            return res.status(400).json({ message: "Debe seleccionar un solo tipo"});
        }

        if(req.body.dia) {
            req.body.dia = String(req.body.dia).toLowerCase().trim()
        }

        if (req.body.dia === "día") {
            if (SHOW_ERRORS) {
                // console.log("DIA: ", req.body.dia);
            }            
            return res.status(400).json({ message: "Debe seleccionar un día de la semana"});
        }

        if (req.body.estado_clase === "Estado") {
            if (SHOW_ERRORS) {
                // console.log("ESTADO CLASE: ", req.body.estado_clase);
            }     
            return res.status(400).json({ message: "Debe seleccionar un estado de la semana"});
        }

        // console.log(req.body.estado_clase);

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            if (SHOW_ERRORS) {
                // console.log("REQ BODY: ", req.body);
                // console.log("ERROR: ", error.message || undefined);
            }                 
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result =updateValidation.validate(req.body);

        if(result.error){
            if (SHOW_ERRORS) {
                // console.log("REQ BODY: ", req.body);
                // console.log("ERROR: ", result.error.message || undefined);
            }                      
            return handleErrorClient(res, 400, "falto actualizar parametros", result.error.message);
        }

        const claseUpdate = await getClaseSer(id);

        if(!claseUpdate){
            return handleErrorClient(res, 404, "Clase no encontrada");
        }

        Object.assign(claseUpdate, req.body);
        if (vehiculoEncontrado && vehiculoEncontrado.patente) {
            Object.assign(claseUpdate, {vehiculos: vehiculoEncontrado});
        }
        if ((req?.user?.rol === TEACHER_ROLE) && (claseUpdate.id_profesor !== (req?.user?.id || req?.user?.sub))) {
            return handleErrorClient(res, 400, "No puede actualizar a otro profesor");
        }

        const updatedClase = await updateClaseSer(claseUpdate);
        if(!(updatedClase.data)){
            if(!updatedClase.error){
                return handleErrorClient(res, 500, updatedClase.message);
            }
            if (SHOW_ERRORS) {
                // console.log("ERROR?:", updatedClase?.message || undefined);
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
        const { id } = req.params;
        const validatedId = idValidation.validate({ id });
        if (validatedId.error) {
            return handleErrorClient(res, 400, validatedId.error.message);
        }

        const idsEliminar = Array.isArray(req.body?.idsEliminar) ? req.body.idsEliminar : [];


        const result = await editarAsignacionLoteSer(id, idsEliminar);

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

export async function asignacionIndividual(req, res) {
    try {
        const { id } = req.params;
        const { id_usuario } = req.body;
        // console.log("ID USUARIO: ", id_usuario);

        const validatedId = idValidation.validate({ id });
        if (validatedId.error) {
            return handleErrorClient(res, 400, "id de clase inavlido",validatedId.error.message);
        }

        const validatedUserId = idValidation.validate({ id: id_usuario });
        if (validatedUserId.error) {
            return handleErrorClient(res, 400, "id_usuario inválido", validatedUserId.error.message);
        }

        const result = await asignacionIndividualService(id, id_usuario);

        if (result.error) {
            return handleErrorClient(res, 400, "error al signar");
        }

        return handleSuccess(res, 200, "asignacion individual a clase practica exitosa", result.data);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor", error.message, error);
    }
}

export async function desasignacionIndividual(req, res) {
    try {
        const { id } = req.params;
        const { id_usuario } = req.body;

        const validatedId = idValidation.validate({ id });
        if (validatedId.error) {
            return handleErrorClient(res, 400, "id de clase inválido", validatedId.error.message);
        }

        const validatedUserId = idValidation.validate({ id: id_usuario });
        if (validatedUserId.error) {
            return handleErrorClient(res, 400, "id_usuario inválido", validatedUserId.error.message);
        }

        const result = await desasignacionIndividualService(id, id_usuario);

        if (result.error) {
            return handleErrorClient(res, 400, result.message);
        }

        return handleSuccess(res, 200, "desasignacion individual de clase practica exitosa", result.data);
    } catch (error) {
        console.error(error);
        return handleErrorServer(res, 500, "Error interno del servidor", error.message, error);
    }
}

