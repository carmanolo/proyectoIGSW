"use strict";
import { AppDataSource } from "../config/configDb.js";
import PagoDeuda from "../entities/pago_deuda.entity.js";
import Inscripcion from "../entities/Inscripcion.entity.js";
import Venta from "../entities/venta.entity.js";
import User from "../entities/user.entity.js";

export async function crearPagoDeuda(user, monto, comprobante, tipo_deuda, deuda_id) {
  try {
    const pagoRepository = AppDataSource.getRepository(PagoDeuda);
    const nuevoPago = pagoRepository.create({
      monto,
      comprobante,
      tipo_deuda,
      deuda_id,
      user
    });
    const result = await pagoRepository.save(nuevoPago);
    return [result, null];
  } catch (error) {
    console.error("Error al crear pago de deuda:", error);
    return [null, "Error al crear pago de deuda"];
  }
}

export async function listarPagosPendientes() {
  try {
    const pagoRepository = AppDataSource.getRepository(PagoDeuda);
    const pagos = await pagoRepository.find({
      relations: { user: true },
      order: { fecha_solicitud: "DESC" }
    });
    return [pagos, null];
  } catch (error) {
    console.error("Error al listar pagos pendientes:", error);
    return [null, "Error al listar pagos pendientes"];
  }
}

export async function listarPagosPendientesUsuario(userId) {
  try {
    const pagoRepository = AppDataSource.getRepository(PagoDeuda);
    const pagos = await pagoRepository.find({
      where: { estado: "pendiente", user: { id: userId } },
      order: { fecha_solicitud: "DESC" }
    });
    return [pagos, null];
  } catch (error) {
    console.error("Error al listar pagos del usuario:", error);
    return [null, "Error al listar pagos del usuario"];
  }
}

export async function aprobarPago(pagoId) {
  try {
    const pagoRepository = AppDataSource.getRepository(PagoDeuda);
    const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
    const ventaRepository = AppDataSource.getRepository(Venta);

    const pago = await pagoRepository.findOne({ where: { id: pagoId } });
    if (!pago) return [null, "Pago no encontrado"];
    if (pago.estado !== "pendiente") return [null, "El pago ya no está pendiente"];

    pago.estado = "aprobado";
    pago.fecha_resolucion = new Date();

    if (pago.tipo_deuda === "inscripcion") {
      const inscripcion = await inscripcionRepository.findOne({ where: { id_inscripcion: pago.deuda_id } });
      if (!inscripcion) return [null, "Inscripción no encontrada"];
      
      const nuevoMontoPagado = Number(inscripcion.monto_pagado) + Number(pago.monto);
      inscripcion.monto_pagado = nuevoMontoPagado;
      
      if (nuevoMontoPagado >= Number(inscripcion.monto_total)) {
        inscripcion.estado_pago = "pagado";
        inscripcion.fecha_pago_completo = new Date();
      } else {
        inscripcion.estado_pago = "parcial";
      }
      
      await inscripcionRepository.save(inscripcion);
    } else if (pago.tipo_deuda === "venta") {
      const venta = await ventaRepository.findOne({ where: { id: pago.deuda_id } });
      if (!venta) return [null, "Venta no encontrada"];
      
      const nuevoMontoPagado = Number(venta.monto_pagado || 0) + Number(pago.monto);
      venta.monto_pagado = nuevoMontoPagado;

      if (nuevoMontoPagado >= Number(venta.monto_total)) {
        venta.estado = "completado";
        venta.fecha_vencimiento = null;
      } else {
        // Extender 30 días la próxima cuota
        venta.fecha_vencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      await ventaRepository.save(venta);
    }

    await pagoRepository.save(pago);
    return [pago, null];
  } catch (error) {
    console.error("Error al aprobar pago:", error);
    return [null, "Error interno del servidor al aprobar pago"];
  }
}

export async function rechazarPago(pagoId) {
  try {
    const pagoRepository = AppDataSource.getRepository(PagoDeuda);
    const pago = await pagoRepository.findOne({ where: { id: pagoId }, relations: { user: true } });
    if (!pago) return [null, "Pago no encontrado"];
    if (pago.estado !== "pendiente") return [null, "El pago ya no está pendiente"];

    pago.estado = "rechazado";
    pago.fecha_resolucion = new Date();
    await pagoRepository.save(pago);

    return [pago, null];
  } catch (error) {
    console.error("Error al rechazar pago:", error);
    return [null, "Error interno del servidor al rechazar pago"];
  }
}
