"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { crearPagoDeuda, listarPagosPendientes, aprobarPago, rechazarPago, listarPagosPendientesUsuario } from "../services/pago.service.js";

export async function solicitarPago(req, res) {
  try {
    const { monto, tipo_deuda, deuda_id } = req.body;
    const user = req.user;
    
    let comprobante = null;
    if (req.file) {
      comprobante = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!comprobante) {
      return handleErrorClient(res, 400, "Comprobante es obligatorio");
    }

    if (!monto || !tipo_deuda || !deuda_id) {
      return handleErrorClient(res, 400, "Faltan datos obligatorios");
    }

    const [nuevoPago, error] = await crearPagoDeuda(user, monto, comprobante, tipo_deuda, deuda_id);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    
    return handleSuccess(res, 201, "Solicitud de pago enviada correctamente", nuevoPago);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function listarPagos(req, res) {
  try {
    const [pagos, error] = await listarPagosPendientes();
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Pagos pendientes obtenidos correctamente", pagos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function listarMisPagos(req, res) {
  try {
    const user = req.user;
    const [pagos, error] = await listarPagosPendientesUsuario(user.id);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Tus pagos pendientes obtenidos correctamente", pagos);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function aprobar(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await aprobarPago(id);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Pago aprobado correctamente", pago);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function rechazar(req, res) {
  try {
    const { id } = req.params;
    const [pago, error] = await rechazarPago(id);
    if (error) {
      return handleErrorClient(res, 400, error);
    }
    return handleSuccess(res, 200, "Pago rechazado correctamente", pago);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}
