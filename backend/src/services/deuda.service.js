import { AppDataSource } from "../config/configDb.js";
import { Deuda } from "../entities/Deuda.entity.js";

export class DeudaService {
  constructor() {
    this.deudaRepository = AppDataSource.getRepository(Deuda);
  }

 
  async crearDeuda(data) {
    const { monto, fecha_vencimiento, descripcion, estado } = data;

    if (!monto || !fecha_vencimiento) {
      throw new Error("Faltan campos obligatorios");
    }

    const nuevaDeuda = this.deudaRepository.create({
      monto,
      fecha_vencimiento,
      descripcion,
      estado: estado || "pendiente",
    });

    return await this.deudaRepository.save(nuevaDeuda);
  }

 
  async obtenerTodasLasDeudas() {
    return await this.deudaRepository.find();
  }

  
  async obtenerDeudaPorId(id) {
    const deuda = await this.deudaRepository.findOne({
      where: { id_deuda: id },
    });

    if (!deuda) {
      throw new Error("Deuda no encontrada");
    }

    return deuda;
  }

 
  async eliminarDeuda(id) {
    const deuda = await this.obtenerDeudaPorId(id);
    await this.deudaRepository.remove(deuda);
    return { message: "Deuda eliminada correctamente" };
  }


  async cambiarEstado(id, nuevoEstado) {
    const estadosValidos = ["pendiente", "pagada", "vencida"];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error("Estado no válido");
    }

    const deuda = await this.obtenerDeudaPorId(id);
    deuda.estado = nuevoEstado;
    return await this.deudaRepository.save(deuda);
  }

 
  async pagarDeuda(id, montoPago) {
    if (!montoPago || montoPago <= 0) {
      throw new Error("El monto del pago debe ser mayor a 0");
    }

    const deuda = await this.obtenerDeudaPorId(id);

    if (deuda.estado === "pagada") {
      throw new Error("Esta deuda ya está completamente pagada");
    }

    const nuevoMontoPagado = parseFloat(deuda.monto_pagado) + parseFloat(montoPago);

    if (nuevoMontoPagado > deuda.monto) {
      throw new Error(
        `El pago excede el monto total. Restante: ${deuda.monto - deuda.monto_pagado}`
      );
    }

    deuda.monto_pagado = nuevoMontoPagado;

    if (deuda.monto_pagado === deuda.monto) {
      deuda.estado = "pagada";
      deuda.fecha_pago = new Date();
    }

    const resultado = await this.deudaRepository.save(deuda);

    return {
      message: "Pago realizado exitosamente",
      deuda: resultado,
    };
  }
}