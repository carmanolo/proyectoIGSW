import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createIncidenciaSer, getIncidenciasSer, updateIncidenciaStatusSer } from "../services/incidencia.service.js";
import { incidenciaValidation } from "../validations/incidencia.validation.js";

export async function createIncidencia(req, res) {
  try {
    const { error } = incidenciaValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const userId = req.user?.sub || req.user?.id; // asumiendo que el middleware jwt.middleware setea req.user
    if (!userId) {
      return handleErrorClient(res, 401, "No autorizado", "Usuario no autenticado");
    }

    const dataToSave = {
      ...req.body,
      profesor_id: userId,
    };

    const newIncidencia = await createIncidenciaSer(dataToSave);
    if (!newIncidencia) {
      return handleErrorServer(res, 500, "Error interno", "No se pudo crear la incidencia");
    }

    return handleSuccess(res, 201, "Incidencia reportada exitosamente", newIncidencia);
  } catch (error) {
    return handleErrorServer(res, 500, "Error en el servidor al registrar la incidencia", error.message);
  }
}

export async function getIncidencias(req, res) {
  try {
    const userRole = req.user?.rol;
    const userId = req.user?.sub || req.user?.id;
    
    let filtros = {};
    if (userRole === "profesor") {
      filtros.profesor_id = userId;
    } else if (userRole === "secretario") {
      if (req.query.estado) filtros.estado = req.query.estado;
      if (req.query.vehiculo_id) filtros.vehiculo_id = req.query.vehiculo_id;
    } else {
      return handleErrorClient(res, 403, "Prohibido", "No tienes permisos para ver incidencias");
    }

    const incidencias = await getIncidenciasSer(filtros);
    return handleSuccess(res, 200, "Incidencias obtenidas exitosamente", incidencias || []);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener las incidencias", error.message);
  }
}

export async function patchIncidenciaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['pendiente', 'en_revision', 'resuelto'].includes(estado)) {
      return handleErrorClient(res, 400, "Estado inválido", "El estado debe ser pendiente, en_revision o resuelto");
    }

    const updatedIncidencia = await updateIncidenciaStatusSer(id, estado);
    if (!updatedIncidencia) {
      return handleErrorClient(res, 404, "Incidencia no encontrada", "No existe la incidencia con el id proporcionado");
    }

    return handleSuccess(res, 200, "Estado actualizado exitosamente", updatedIncidencia);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al actualizar la incidencia", error.message);
  }
}
