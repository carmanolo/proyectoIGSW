import { AppDataSource } from "../config/configDb.js";
import { Evaluacion } from "../entities/evaluacion.entity.js";

/*export async function createEvaluacion({id_evaluacion}) {
    try{
        const evaluacionRepository = AppDataSource.getRepository(Evaluacion);

        const evaluacionFound = await evaluacionRepository.findOne({
            where: [{ id_evaluacion: id_evaluacion}]
        })

        if(!evaluacionFound) return [null, "evaluacion no encontrado"]

    }catch(error){
        console.error("Error al obtener el evaluacion", error)
        return [null, "Error interno del servidor"]
    }
}
*/
export async function getEvaluacionSer() {
    try {
        const evaluacionRepository = AppDataSource.getRepository(Evaluacion);

        const evaluacion = await evaluacionRepository.find();

        if (!evaluacion || evaluacion.length === 0) return [null, "No hay evaluacions"];

        return [evaluacion, null];

    } catch (error) {
        console.error("Error al obtener los evaluacions", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createEvaluacionSer(id_evaluacion, tipo, alumno, calificacionfinal, resultadomanejo, Resultado, comentario) {

  const evaluacionRepository = AppDataSource.getRepository(Evaluacion);

  try {
    if (!id_evaluacion || !tipo || !alumno || !Resultado || !comentario) {
      throw Error("Función mal llamada", {id_evaluacion, tipo, alumno, Resultado, comentario});
    }
    const newevaluacion = evaluacionRepository.create({
      id_evaluacion,
      tipo,
      alumno,
      calificacionfinal,
      resultadomanejo,
      Resultado ,
      comentario
    });
    await evaluacionRepository.save(newevaluacion);
    return newevaluacion;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateEvaluacionSer(evaluacion) {
  try{
    if(!evaluacion){
      throw new Error("Funcion mal llamada");
    }

    return {data: await evaluacionRepository.save(evaluacion), message: "evaluacion actualizado con éxito", error: null}
    
  }catch(error){
    console.error("Error al actualizar el evaluacion:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteEvaluacion(id_evaluacion) {
  try{
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    const evaluacion = await evaluacionRepository.findOne({where: { id_evaluacion:id_evaluacion}});

    if(!evaluacion){
      return { result: null, message: "evaluacion no encontrado"}
    }

    return{
      result: (await evaluacionRepository.delete({id_evaluacion: evaluacion.id_evaluacion})),
      message: "evaluacion eliminado exitosamente"
    };
  } catch (error){
    console.error(error);
    return { result: null, message: "Error al eliminar el evaluacion" };
  }
}