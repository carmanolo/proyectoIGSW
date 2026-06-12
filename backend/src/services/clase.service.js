import { error } from "console";
import { AppDataSource } from "../config/configDb.js";
import { Clase } from "../entities/clase.entity.js";
import { User } from "../entities/user.entity.js";
import { createRequire } from "module";
import { In } from "typeorm";

const require = createRequire(import.meta.url);
// SER=service
export async function getClaseSer(id_clase) {
    try{
        const claseRepository = AppDataSource.getRepository(Clase);
        return await claseRepository.findOne({
            where: {id_clase: id_clase}, relations: {user: true}
        });

    }catch(error){
        console.error("Error al obtener la clase", error)
        return [null, "Error interno del servidor"]
    }
}

export async function asignarPorLoteService() {
  try {
    const estudiantes = require("../data/students.json");

    if(!estudiantes || estudiantes.length === 0){
      return {data: null, message: "No hay estudiantes en el archivo JSON", error: true}
    }

    const claseRepository = AppDataSource.getRepository(Clase);
    const clasesTeoricas = await claseRepository.find({
      where: { tipo: "teorica" },
      relations: { user: true},
    });

    if(!clasesTeoricas || clasesTeoricas.length === 0){
      [null, "No hay clases teoricas"];
    }

    const userRepository = AppDataSource.getRepository(User);
    const ids = estudiantes.map((s) => s.id);
    const usuarios = await userRepository.findBy({ id: In(ids)});

    if(!usuarios || usuarios.length === 0){
      return [null, "No hay usuarios en el JSON"];
    }

    const GRUPOS = 5;
    const asignaciones = [];

    //aSIGNAr USuarios

    for(let i =0; i < usuarios.length; i++){
      //se usa math floor para rendondear resultado y obtener una distribución eficiente
      const grupoIndex = Math.floor(i / GRUPOS);
      const clase = clasesTeoricas[grupoIndex % clasesTeoricas.length];
      clase.user= usuarios[i];
      const saved = await claseRepository.save(clase);
      asignaciones.push({
        id_clase: saved.id_clase,
        tipo: saved.tipo,
        grupo: grupoIndex + 1,
        usuario_asignado: {
          id: usuarios[i].id,
          nombre: usuarios[i].nombre,
          email: usuarios[i].email
        },
      });
    }

    return {
      data: asignaciones,
      message: `${asignaciones.length} estudiante(s) asignados a clases teóricas exitosamente`,
      error: false,
    }


  } catch (error) {
    console.error("Error en asignar por Lote", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getClasesSer() {
    try {
        const claseRepository = AppDataSource.getRepository(Clase);

        const clases = await claseRepository.find();

        if (!clases || clases.length === 0) return [null, "No hay clases"];

        return [clases, null];

    } catch (error) {
        console.error("Error al obtener las clases:", error);
        return [null, "Error interno del servidor"];
    }
}

//enviar parametros que se ingresaran en el body
export async function createClaseSer( tipo, descripcion ,fecha_clase, hora_inicio, hora_fin, dia) {

  const claseRepository = AppDataSource.getRepository(Clase);

  try {
    if (!tipo||!descripcion||!fecha_clase||!hora_inicio || !hora_fin || !dia) {
      //console.log( hora_inicio,hora_fin, dia);
      throw Error("Función mal llamada", { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia})
    }
    const newClase = claseRepository.create({
      tipo, 
      descripcion,
      fecha_clase,
      hora_inicio,
      hora_fin,
      dia,
      relations: {user:true}
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
    const clase = await claseRepository.findOne({where: { id_clase:id_clase}, relations: {user:true}});

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




