"use strict";
import {  registrarUsuarioConBoletaService, obtenerListaEsperaService, verificarRegistroService, obtenerDetalleSolicitudService, contarSolicitudesPendientesService } from "../services/registroEspera.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { registroEsperaValidation } from "../validations/registro.validation.js";
import fs from 'fs';

export async function solicitarRegistroConBoleta(req, res) {
  try {
    console.log(' Archivo recibido:', req.file ? req.file.originalname : 'NO HAY ARCHIVO');
    console.log(' Body recibido:', req.body);

    if (!req.file) {
      return handleErrorClient(res, 400, "Debe subir un archivo PDF de la boleta");
    }

    const { error, value } = registroEsperaValidation.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.log(' ERRORES DE VALIDACIÓN:');
      error.details.forEach((detail, index) => {
        console.log(`  ${index + 1}. Campo "${detail.path.join('.')}": ${detail.message}`);
        console.log(`     Valor recibido: "${req.body[detail.path[0]]}"`);
      });
      
      if (req.file.path) fs.unlinkSync(req.file.path);
      return handleErrorClient(res, 400, "Datos inválidos", error.details);
    }

    console.log(' Validación exitosa');

    const resultado = await registrarUsuarioConBoletaService(req.body, req.file);

    if (resultado.error) {
      console.log(' Error en servicio:', resultado.details);
      if (req.file.path) fs.unlinkSync(req.file.path);
      return handleErrorServer(res, 500, "Error al procesar", resultado.details);
    }

    return handleSuccess(res, 201, resultado.details, resultado.data);
  } catch (error) {
    console.error(' Error en solicitarRegistroConBoleta:', error);
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
    console.error('Error en obtenerListaEspera:', error);
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
    if (!estado || !['verificado', 'rechazado'].includes(estado)) {
      return handleErrorClient(res, 400, "Estado inválido. Debe ser 'verificado' o 'rechazado'");
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
    console.error('Error en verificarRegistro:', error);
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}

export async function obtenerDetalleSolicitud(req, res) {
  try {
    const { id } = req.params;
    const idResult = idValidation.validate({ id });
    if (idResult.error) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    const resultado = await obtenerDetalleSolicitudService(parseInt(id));
    if (resultado.error) {
      return handleErrorServer(res, 500, "Error al obtener detalle", resultado.details);
    }

    if (!resultado.data) {
      return handleErrorClient(res, 404, "Solicitud no encontrada");
    }

    return handleSuccess(res, 200, resultado.details, resultado.data);
  } catch (error) {
    console.error('Error en obtenerDetalleSolicitud:', error);
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}

export async function contarSolicitudesPendientes(req, res) {
  try {
    const resultado = await contarSolicitudesPendientesService();
    if (resultado.error) {
      return handleErrorServer(res, 500, "Error al contar", resultado.details);
    }
    return handleSuccess(res, 200, "Conteo de solicitudes pendientes", { pendientes: resultado.data });
  } catch (error) {
    console.error('Error en contarSolicitudesPendientes:', error);
    return handleErrorServer(res, 500, "Error interno", error.message);
  }
}