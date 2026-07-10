import { AppDataSource } from "../config/configDb.js";
import IncidenciaVehiculo from "../entities/incidencia_vehiculo.entity.js";

export async function createIncidenciaSer(incidenciaData) {
  try {
    const incidenciaRepository = AppDataSource.getRepository(IncidenciaVehiculo);
    const nuevaIncidencia = incidenciaRepository.create({
      vehiculo: { id: incidenciaData.vehiculo_id },
      profesor: { id: incidenciaData.profesor_id },
      tipo: incidenciaData.tipo,
      descripcion: incidenciaData.descripcion,
      kilometraje_actual: incidenciaData.kilometraje_actual || null,
      estado: "pendiente",
    });

    return await incidenciaRepository.save(nuevaIncidencia);
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    return null;
  }
}

export async function getIncidenciasSer(filtros = {}) {
  try {
    const incidenciaRepository = AppDataSource.getRepository(IncidenciaVehiculo);
    
    let where = {};
    if (filtros.profesor_id) {
      where.profesor = { id: filtros.profesor_id };
    }
    if (filtros.vehiculo_id) {
      where.vehiculo = { id: filtros.vehiculo_id };
    }
    if (filtros.estado) {
      where.estado = filtros.estado;
    }

    const incidencias = await incidenciaRepository.find({
      where,
      relations: ["vehiculo", "profesor"],
      order: { fecha_reporte: "DESC" },
    });

    return incidencias;
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    return null;
  }
}

export async function updateIncidenciaStatusSer(id, estado) {
  try {
    const incidenciaRepository = AppDataSource.getRepository(IncidenciaVehiculo);
    const incidencia = await incidenciaRepository.findOne({ where: { id: Number(id) } });
    
    if (!incidencia) {
      return null;
    }

    incidencia.estado = estado;
    return await incidenciaRepository.save(incidencia);
  } catch (error) {
    console.error("Error al actualizar estado de incidencia:", error);
    return null;
  }
}
