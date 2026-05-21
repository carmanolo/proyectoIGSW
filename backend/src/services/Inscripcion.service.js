import { AppDataSource } from "../config/configDb.js";
import { Inscripcion } from "../entities/Inscripcion.entity.js";
import { PlanService } from "./Plan.service.js";

export class InscripcionService {
  constructor() {
    this.inscripcionRepository = AppDataSource.getRepository(Inscripcion);
    this.planService = new PlanService();
  }


  async contratarPlan(data) {
    const { alumno_id, plan_id, fecha_inicio, fecha_vencimiento_pago } = data;

    const plan = await this.planService.obtenerPlanPorId(plan_id);
    if (plan.estado !== "activo") {
      throw new Error("El plan no está disponible actualmente");
    }

    const tieneDeudaPendiente = await this.alumnoTieneDeudaPendiente(alumno_id);
    if (tieneDeudaPendiente) {
      throw new Error("No puede contratar un nuevo plan porque tiene una deuda pendiente");
    }


    const fechaFin = this.calcularFechaFin(fecha_inicio, plan.duracion_semanas);


    const nuevaInscripcion = this.inscripcionRepository.create({
      alumno_id,
      plan_id,
      fecha_inicio: new Date(fecha_inicio),
      fecha_fin: fechaFin,
      estado_pago: "pendiente",
      monto_total: plan.costo,
      monto_pagado: 0,
      fecha_vencimiento_pago: fecha_vencimiento_pago || this.calcularFechaVencimiento(),
      estado_inscripcion: "activa",
    });

    return await this.inscripcionRepository.save(nuevaInscripcion);
  }


  async alumnoTieneDeudaPendiente(alumno_id) {
    const deudasPendientes = await this.inscripcionRepository.find({
      where: {
        alumno_id: alumno_id,
        estado_pago: "pendiente",
      },
    });
    return deudasPendientes.length > 0;
  }

  async obtenerDeudasPendientes(alumno_id) {
    return await this.inscripcionRepository.find({
      where: {
        alumno_id: alumno_id,
        estado_pago: "pendiente",
      },
      relations: ["plan_id"],
    });
  }

  async pagarDeuda(id_inscripcion, montoPago) {
    if (!montoPago || montoPago <= 0) {
      throw new Error("El monto del pago debe ser mayor a 0");
    }

    const inscripcion = await this.obtenerInscripcionPorId(id_inscripcion);

    if (inscripcion.estado_pago === "pagado") {
      throw new Error("Esta deuda ya está completamente pagada");
    }

    const nuevoMontoPagado = parseFloat(inscripcion.monto_pagado) + parseFloat(montoPago);

    if (nuevoMontoPagado > inscripcion.monto_total) {
      const restante = inscripcion.monto_total - inscripcion.monto_pagado;
      throw new Error(`El pago excede el monto total. Restante: ${restante}`);
    }

    inscripcion.monto_pagado = nuevoMontoPagado;

    if (inscripcion.monto_pagado >= inscripcion.monto_total) {
      inscripcion.estado_pago = "pagado";
      inscripcion.fecha_pago_completo = new Date();
    }

    const resultado = await this.inscripcionRepository.save(inscripcion);

    return {
      message: "Pago realizado exitosamente",
      inscripcion: resultado,
    };
  }


  async obtenerInscripcionPorId(id) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id_inscripcion: id },
    });
    if (!inscripcion) {
      throw new Error("Inscripción no encontrada");
    }
    return inscripcion;
  }

  async obtenerInscripcionesPorAlumno(alumno_id) {
    return await this.inscripcionRepository.find({
      where: { alumno_id: alumno_id },
    });
  }


  async cancelarInscripcion(id_inscripcion) {
    const inscripcion = await this.obtenerInscripcionPorId(id_inscripcion);
    
    if (inscripcion.estado_pago === "pendiente") {
      throw new Error("No se puede cancelar la inscripción porque tiene una deuda pendiente");
    }
    
    inscripcion.estado_inscripcion = "cancelada";
    return await this.inscripcionRepository.save(inscripcion);
  }

  calcularFechaFin(fechaInicio, duracionSemanas) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + (duracionSemanas * 7));
    return fecha;
  }

  calcularFechaVencimiento() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 15); 
    return fecha;
  }
}