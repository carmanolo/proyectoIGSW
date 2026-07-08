"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createEvaluacionSer, getEvaluacionSer, updateEvaluacionSer, deleteEvaluacion as deleteEvaluacionSer } from "../services/evaluacion.service.js";
import { assignationValidation, integrityValidation, updateValidation } from "../validations/evaluaciones.validations.js";
import { idValidation } from "../validations/modules/id.validation.js";

export async function createEvaluacion(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Datos no proporcionados" });
    }

    const { error } = integrityValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
    }

    const result = assignationValidation.validate(req.body);
    if (result.error) {
      return handleErrorClient(res, 400, "Faltan parámetros", result.error.message);
    }

    const files = req.files || {};

    const newEvaluacion = await createEvaluacionSer({
      ...req.body,
    });

    if (newEvaluacion) {
      return res.status(201).json({ message: "Evaluacion registrada exitosamente", data: newEvaluacion });
    }

    return res.status(500).json({ message: "Error al registrar evaluacion" });
  } catch (error) {
    console.error("error en registro de evaluacion", error);
    return res.status(500).json({ message: "Error al registrar la evaluacion" });
  }
}

export async function getEvaluacion(req, res) {
  try {
    const evaluacionData = await getEvaluacionSer();
    if (!evaluacionData || evaluacionData.length === 0) {
      return handleErrorClient(res, 400, "Evaluaciones no encontradas");
    }
    return handleSuccess(res, 200, "Evaluaciones obtenidas exitosamente", evaluacionData);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al obtener evaluaciones", error.message);
  }
}

export async function patchEvaluacion(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Datos no proporcionados" });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "El ID de la evaluacion es obligatorio" });
    }

    const validatedId = idValidation.validate({ id });
    if (validatedId.error) {
      return res.status(400).json({ message: validatedId.error.message });
    }

    const { error } = integrityValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
    }

    const result = updateValidation.validate(req.body);
    if (result.error) {
      return handleErrorClient(res, 400, "Faltan parámetros para actualizar", result.error.message);
    }

    const evaluacionUpdate = await getEvaluacionSer(id);
    if (!evaluacionUpdate) {
      return handleErrorClient(res, 404, "Evaluacion no encontrada");
    }

    const files = req.files || {};

    Object.assign(evaluacionUpdate, req.body);
    const updatedEvaluacion = await updateEvaluacionSer(evaluacionUpdate);

    if (!updatedEvaluacion.data) {
      if (!updatedEvaluacion.error) {
        return handleErrorClient(res, 500, updatedEvaluacion.message);
      }
      return handleErrorClient(res, 400, updatedEvaluacion.message);
    }

    return handleSuccess(res, 200, "Evaluacion actualizada con éxito", updatedEvaluacion.data);
  } catch (error) {
    return handleErrorServer(res, 500, "error interno del servidor", error.message);
  }
}

export async function deleteEvaluacion(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "El ID de la evaluacion es obligatorio" });
    }

    const result = await deleteEvaluacionSer(id);
    if (result && result.result && result.result.affected >= 1) {
      return handleSuccess(res, 200, "Evaluacion eliminada exitosamente");
    }

    return handleErrorClient(res, 400, result.message, result.result);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al eliminar la evaluacion", error.message);
  }
}
