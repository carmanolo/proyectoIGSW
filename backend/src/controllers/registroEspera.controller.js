"use strict";
import { 
  registrarUsuarioConBoletaService,
  obtenerListaEsperaService,
  verificarRegistroService
} from "../services/registroEspera.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { registroEsperaValidation } from "../validations/registro.validation.js";
import fs from 'fs';

export async function solicitarRegistroConBoleta(req, res) {
  try {
    if (!req.file) {
      return handleErrorClient(res, 400, "Debe subir un archivo PDF de la boleta");
    }

    const { error } = registroEsperaValidation.validate(req.body);
    if (error) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      return handleErrorClient(res, 400, "Datos inválidos", error.details);
    }

    const resultado = await registrarUsuarioConBoletaService(req.body, req.file);

    if (resultado.error) {
      if (req.file.path) fs.unlinkSync(req.file.path);
      return handleErrorServer(res, 500, "Error al procesar", resultado.details);
    }

    return handleSuccess(res, 201, resultado.details, resultado.data);
  } catch (error) {
    if (req.file && req.file.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}

export async function obtenerListaEspera(req, res) {
  try {
    const resultado = await obtenerListaEsperaService();
    if (resultado.error) {
      return handleErrorServer(res, 500, "Error", resultado.details);
    }
    return handleSuccess(res, 200, resultado.details, resultado.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}

export async function verificarRegistro(req, res) {
  try {
    const { id } = req.params;
    const idResult = idValidation.validate({ id });
    if (idResult.error) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    const { estado, observaciones } = req.body;
    if (!estado || !['verificada', 'rechazada'].includes(estado)) {
      return handleErrorClient(res, 400, "Estado inválido");
    }

    const datosVerificacion = {
      estado,
      observaciones: observaciones || null,
      verificador_id: req.user?.id || null
    };

    const resultado = await verificarRegistroService(parseInt(id), datosVerificacion);
    if (resultado.error) {
      return handleErrorServer(res, 500, "Error al verificar", resultado.details);
    }

    return handleSuccess(res, 200, resultado.details, resultado.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}