import { AppDataSource } from "../config/configDb.js";
import { Clase } from "../entities/clase.entity.js";

// SER=service
export async function getClaseSer(id_clase) {
    try{
        const claseRepository = AppDataSource.getRepository(Clase);
        return await claseRepository.findOne({
            where: {id_clase: id_clase}
        });

    }catch(error){
        console.error("Error al obtener la clase", error)
        return [null, "Error interno del servidor"]
    }
}

export async function getClasesSer() {
    try {
        const claseRepository = AppDataSource.getRepository(Clase);

        const clases = await claseRepository.find();

        if (!clases || clases.length === 0) return [null, "No hay horarios"];

        return [clases, null];

    } catch (error) {
        console.error("Error al obtener las clases:", error);
        return [null, "Error interno del servidor"];
    }
}

//enviar parametros que se ingresaran en el body
export async function createClaseSer( tipo, descripcion ,hora_inicio, hora_fin, dia) {

  const claseRepository = AppDataSource.getRepository(Clase);

  try {
    if ( !tipo||!descripcion||!hora_inicio || !hora_fin || !dia) {
      console.log( hora_inicio,hora_fin, dia);
      throw Error("Función mal llamada", { tipo, descripcion, hora_inicio, hora_fin, dia})
    }
    const newClase = claseRepository.create({
      tipo, 
      descripcion,
      hora_inicio,
      hora_fin,
      dia,
    });
    await claseRepository.save(newClase);
    return newClase;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateClaseSer(clase) {
  const claseRepository = AppDataSource.getRepository(Clase);
  try{
    if(!clase){
      throw new Error("Funcion mal llamada");
    }
    return {data: await claseRepository.save(clase), message: "CLASE actualizada con éxito", error: null}
    
  }catch(error){
    console.error("Error al actualizar el horario:", error);
    return [null, "Error interno del servidor"];
  }
  
}

export async function deleteClaseSer(id_clase) {
  try{
    const claseRepository = AppDataSource.getRepository(Clase);
    const clase = await claseRepository.findOne({where: { id_clase:id_clase}});

    if(!clase){
      return { result: null, message: "Clase no encontrado"}
    }

    return{
      result: (await claseRepository.delete({id_clase: clase.id_clase})),
      message: "Clase eliminado exitosamente"
    };
  } catch (error){
    console.error(error);
    return { result: null, message: "Error al eliminar la clase" };
  }
}




