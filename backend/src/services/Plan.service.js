import { AppDataSource } from "../config/configDb.js";
import { Plan } from "../entities/plan.entity.js";

const planRepository = AppDataSource.getRepository(Plan);


export async function crearPlan(data) {
  const { nombre, costo, duracion_semanas, descripcion, tipo, clases_totales } = data;

  if (!nombre || !costo || !duracion_semanas || !clases_totales) {
    throw new Error("Faltan campos obligatorios: nombre, costo, duracion_semanas, clases_totales");
  }

  const planExistente = await planRepository.findOne({
    where: { nombre: nombre },
  });

  if (planExistente) {
    throw new Error("Ya existe un plan con ese nombre");
  }

  const nuevoPlan = planRepository.create({
    nombre,
    costo,
    duracion_semanas,
    descripcion,
    tipo: tipo || "completo",
    clases_totales,
    estado: "activo",
  });

  return await planRepository.save(nuevoPlan);
}

export async function obtenerTodosLosPlanes() {
  return await planRepository.find({
    order: { fecha_creacion: "DESC" },
  });
}

export async function obtenerPlanPorId(id) {
  const plan = await planRepository.findOne({
    where: { id_plan: id },
  });

  if (!plan) {
    throw new Error("Plan no encontrado");
  }

  return plan;
}


export async function actualizarPlan(id, data) {
  const plan = await obtenerPlanPorId(id);

  if (data.nombre && data.nombre !== plan.nombre) {
    const planExistente = await planRepository.findOne({
      where: { nombre: data.nombre },
    });
    if (planExistente && planExistente.id_plan !== parseInt(id)) {
      throw new Error("Ya existe otro plan con ese nombre");
    }
  }

  Object.assign(plan, data);
  plan.fecha_actualizacion = new Date();

  return await planRepository.save(plan);
}

export async function eliminarPlan(id) {
  const plan = await obtenerPlanPorId(id);
  await planRepository.remove(plan);
  return { message: "Plan eliminado correctamente" };
}


export async function cambiarEstadoPlan(id, nuevoEstado) {
  const estadosValidos = ["activo", "inactivo"];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error("Estado no válido. Debe ser 'activo' o 'inactivo'");
  }

  const plan = await obtenerPlanPorId(id);
  plan.estado = nuevoEstado;
  plan.fecha_actualizacion = new Date();

  return await planRepository.save(plan);
}

export async function obtenerPlanesActivos() {
  return await planRepository.find({
    where: { estado: "activo" },
    order: { costo: "ASC" },
  });
}

export async function obtenerPlanesPorTipo(tipo) {
  const tiposValidos = ["teorico", "practico", "completo"];
  if (!tiposValidos.includes(tipo)) {
    throw new Error("Tipo no válido. Debe ser 'teorico', 'practico' o 'completo'");
  }

  return await planRepository.find({
    where: { tipo: tipo, estado: "activo" },
  });
}

