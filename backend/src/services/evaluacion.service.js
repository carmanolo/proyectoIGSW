import { AppDataSource } from "../config/configDb.js";
import { Evaluacion } from "../entities/evaluaciones.entity.js";

export async function getEvaluacionSer(id = null) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    if (id) {
      const evaluacion = await evaluacionRepository.findOne({ where: { id_evaluacion: Number(id) } });
      return evaluacion || null;
    }

    const evaluaciones = await evaluacionRepository.find();
    return evaluaciones;
  } catch (error) {
    console.error("Error al obtener los evaluacions", error);
    return null;
  }
}

export async function createEvaluacionSer(evaluacionData) {
  const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
  try {
    const newEvaluacion = evaluacionRepository.create(evaluacionData);
    await evaluacionRepository.save(newEvaluacion);
    return newEvaluacion;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateEvaluacionSer(evaluacion) {
  try {
    if (!evaluacion) {
      throw new Error("Funcion mal llamada");
    }
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    return { data: await evaluacionRepository.save(evaluacion), message: "evaluacion actualizado con éxito", error: null };
  } catch (error) {
    console.error("Error al actualizar el evaluacion:", error);
    return { data: null, message: "Error interno del servidor", error: error.message };
  }
}

export async function deleteEvaluacion(id_evaluacion) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    const evaluacion = await evaluacionRepository.findOne({ where: { id_evaluacion: id_evaluacion } });

    if (!evaluacion) {
      return { result: null, message: "evaluacion no encontrado" };
    }

    return {
      result: await evaluacionRepository.delete({ id_evaluacion: evaluacion.id_evaluacion }),
      message: "evaluacion eliminado exitosamente",
    };
  } catch (error) {
    console.error(error);
    return { result: null, message: "Error al eliminar el evaluacion" };
  }
}
