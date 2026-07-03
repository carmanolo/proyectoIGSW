import { AppDataSource } from "../config/configDb.js";
import { Inscripcion } from "../entities/Inscripcion.entity.js";
import { User } from "../entities/user.entity.js";
import * as planService from "./Plan.service.js";

const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
const userRepository = AppDataSource.getRepository(User);

const calcularFechaFin = (fechaInicio, duracionSemanas) => {
  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + duracionSemanas * 7);
  return fecha;
};

const calcularFechaVencimiento = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 15);
  return fecha;
};

export async function contratarPlan(data) {
  const { alumno_id, plan_id, fecha_inicio, fecha_vencimiento_pago } = data;


  const user = await userRepository.findOne({
    where: { id: alumno_id }
  });
  if (!user) {
    throw new Error("Alumno no encontrado");
  }

  const plan = await planService.obtenerPlanPorId(plan_id);
  if (plan.estado !== "activo") {
    throw new Error("El plan no está disponible actualmente");
  }

  const tieneDeudaPendiente = await alumnoTieneDeudaPendiente(alumno_id);
  if (tieneDeudaPendiente) {
    throw new Error("No puede contratar un nuevo plan porque tiene una deuda pendiente");
  }

  const fechaFin = calcularFechaFin(fecha_inicio, plan.duracion_semanas);

  const nuevaInscripcion = inscripcionRepository.create({
    alumno: user, 
    plan_id: plan_id,
    fecha_inicio: new Date(fecha_inicio),
    fecha_fin: fechaFin,
    estado_pago: "pendiente",
    monto_total: plan.costo,
    monto_pagado: 0,
    fecha_vencimiento_pago: fecha_vencimiento_pago || calcularFechaVencimiento(),
    estado_inscripcion: "activa",
  });

  return await inscripcionRepository.save(nuevaInscripcion);
}

export async function alumnoTieneDeudaPendiente(alumno_id) {
  const deudasPendientes = await inscripcionRepository.find({
    where: {
      alumno: { id: alumno_id }, 
      estado_pago: "pendiente",
    },
  });
  return deudasPendientes.length > 0;
}

export async function obtenerDeudasPendientes(alumno_id) {
  return await inscripcionRepository.find({
    where: {
      alumno: { id: alumno_id }, 
      estado_pago: "pendiente",
    },
    relations: ["alumno"],  
  });
}

export async function pagarDeuda(id_inscripcion, montoPago) {
  if (!montoPago || montoPago <= 0) {
    throw new Error("El monto del pago debe ser mayor a 0");
  }

  const inscripcion = await obtenerInscripcionPorId(id_inscripcion);

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

    // Cuando se paga el plan completo, otorgar las clases disponibles al alumno
    const plan = await planService.obtenerPlanPorId(inscripcion.plan_id);
    if (plan && inscripcion.alumno) {
      const user = inscripcion.alumno;
      user.clases_disponibles = (user.clases_disponibles || 0) + plan.clases_totales;
      await userRepository.save(user);
    }
  } else if (inscripcion.monto_pagado > 0) {
    inscripcion.estado_pago = "parcial";
  }

  const resultado = await inscripcionRepository.save(inscripcion);

  return {
    message: "Pago realizado exitosamente",
    inscripcion: resultado,
    deuda_restante: inscripcion.monto_total - inscripcion.monto_pagado,
  };
}

export async function obtenerInscripcionPorId(id) {
  const inscripcion = await inscripcionRepository.findOne({
    where: { id_inscripcion: id },
    relations: ["alumno"],  
  });
  if (!inscripcion) {
    throw new Error("Inscripción no encontrada");
  }
  return inscripcion;
}

export async function obtenerInscripcionesPorAlumno(alumno_id) {
  return await inscripcionRepository.find({
    where: { alumno: { id: alumno_id } },  
    relations: ["alumno"],
  });
}

export async function cancelarInscripcion(id_inscripcion) {
  const inscripcion = await obtenerInscripcionPorId(id_inscripcion);

  if (inscripcion.estado_pago === "pendiente") {
    throw new Error("No se puede cancelar la inscripción porque tiene una deuda pendiente");
  }

  inscripcion.estado_inscripcion = "cancelada";
  return await inscripcionRepository.save(inscripcion);
}