import { AppDataSource } from "../config/configDb.js";
import { Plan } from "../entities/Plan.entity.js";

export class PlanService {
  constructor() {
    this.planRepository = AppDataSource.getRepository(Plan);
  }

  async crearPlan(data) {
    const { nombre, costo, duracion_semanas, descripcion, tipo, clases_totales } = data;

    if (!nombre || !costo || !duracion_semanas || !clases_totales) {
      throw new Error("Faltan campos obligatorios");
    }

    const nuevoPlan = this.planRepository.create({
      nombre,
      costo,
      duracion_semanas,
      descripcion,
      tipo: tipo || "completo",
      clases_totales,
      estado: "activo",
    });

    return await this.planRepository.save(nuevoPlan);
  }

  async obtenerTodosLosPlanes() {
    return await this.planRepository.find();
  }

  async obtenerPlanPorId(id) {
    const plan = await this.planRepository.findOne({
      where: { id_plan: id },
    });

    if (!plan) {
      throw new Error("Plan no encontrado");
    }

    return plan;
  }

  async actualizarPlan(id, data) {
    const plan = await this.obtenerPlanPorId(id);
    Object.assign(plan, data);
    plan.fecha_actualizacion = new Date();
    return await this.planRepository.save(plan);
  }

  async eliminarPlan(id) {
    const plan = await this.obtenerPlanPorId(id);
    await this.planRepository.remove(plan);
    return { message: "Plan eliminado correctamente" };
  }

  async cambiarEstadoPlan(id, nuevoEstado) {
    const estadosValidos = ["activo", "inactivo"];
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error("Estado no válido");
    }
    const plan = await this.obtenerPlanPorId(id);
    plan.estado = nuevoEstado;
    return await this.planRepository.save(plan);
  }
}