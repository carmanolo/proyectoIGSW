import { AppDataSource } from "../config/configDb.js";
import { Horario } from "../entities/horario.entity.js";

// SER=service
export async function getHorarioSer(id_horario) {
    try{
        const horarioRepository = AppDataSource.getRepository(Horario);
        return await horarioRepository.findOne({
            where: {id_horario: id_horario}
        });

    }catch(error){
        console.error("Error al obtener el hoario", error)
        return [null, "Error interno del servidor"]
    }
}

export async function getHorariosSer() {
    try {
        const horarioRepository = AppDataSource.getRepository(Horario);

        const horarios = await horarioRepository.find();

        if (!horarios || horarios.length === 0) return [null, "No hay horarios"];

        return [horarios, null];

    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        return [null, "Error interno del servidor"];
    }
}

//enviar parametros que se ingresaran en el body
export async function createHorarioSer( hora_inicio, hora_fin, dia) {

  const horarioRepository = AppDataSource.getRepository(Horario);

  try {
    if ( !hora_inicio || !hora_fin || !dia) {
      console.log( hora_inicio,hora_fin, dia);
      throw Error("Función mal llamada", { hora_inicio, hora_fin, dia})
    }
    const newHorario = horarioRepository.create({
      hora_inicio,
      hora_fin,
      dia,
    });
    await horarioRepository.save(newHorario);
    return newHorario;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateHorarioSer(horario) {
  const horarioRepository = AppDataSource.getRepository(Horario);
  try{
    if(!horario){
      throw new Error("Funcion mal llamada");
    }
    return {data: await horarioRepository.save(horario), message: "Horario actualizado con éxito", error: null}
    
  }catch(error){
    console.error("Error al actualizar el horario:", error);
    return [null, "Error interno del servidor"];
  }
  
}

export async function deleteHorarioSer(id_horario) {
  try{
    const horarioRepository = AppDataSource.getRepository(Horario);
    const horario = await horarioRepository.findOne({where: { id_horario:id_horario}});

    if(!horario){
      return { result: null, message: "Hoario no encontrado"}
    }

    return{
      result: (await horarioRepository.delete({id_horario: horario.id_horario})),
      message: "Horario eliminado exitosamente"
    };
  } catch (error){
    console.error(error);
    return { result: null, message: "Error al eliminar el horario" };
  }
}




