import { AppDataSource } from "../config/configDb.js";
import { Clase } from "../entities/clase.entity.js";
import { User } from "../entities/user.entity.js";
import { obtenerIdVehiculoNulo } from "./vehiculo.service.js";

export async function getClaseSer(id_clase) {
    try{
        const claseRepository = AppDataSource.getRepository(Clase);
        const clase = await claseRepository.findOne({
            where: {id_clase: id_clase}, relations: {users: true, vehiculos: true}
        });
        return clase;
    }catch(error){
        console.error("Error al obtener la clase", error)
        return [null, "Error interno del servidor"]
    }
}

export async function asignarPorLoteService() {
  try {
    const useRepository = AppDataSource.getRepository(User);
    const estudiantes = await useRepository.find({
      where: {rol: "estudiante"},
      relations: {clase: true},
    })

    if(!estudiantes || estudiantes.length === 0){
      return {data: null, message: "No hay estudiantes en el archivo JSON", error: true}
    }

    const claseRepository = AppDataSource.getRepository(Clase);
    const clasesTeoricas = await claseRepository.find({
      where: { tipo: "teorica" },
      relations: { users: true},
    });

    if(!clasesTeoricas || clasesTeoricas.length === 0){
      return {data: null, message:"no existen clases teoricas"}
    }


    const asignaciones = [];

    //aSIGNAr USuarios

    for(const clase of clasesTeoricas){
      //se usa math floor para rendondear resultado y obtener una distribución eficiente
      const idsExistentes = new Set(clase.users.map((u) => u.id));
      const nuevos = estudiantes.filter((u)=> !idsExistentes.has(u.id));
      
      clase.users = [...clase.users, ...nuevos];
      const saved = await claseRepository.save(clase);

      asignaciones.push({
        id_clase: saved.id_clase,
        tipo: saved.tipo,
        descripcion: saved.descripcion,
        usuario_asignado: saved.users.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          email: u.email
        })),
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

export async function asignacionIndividualService(id_clase, id_usuario) {
  try {
    if(!id_clase || !id_usuario){
      return {data: null, message: "los id de clase y usuario son rqueridos", error: true}
    }

    const claseRepository = AppDataSource.getRepository(Clase);
    const userRepository = AppDataSource.getRepository(User);

    //conseguir clases de tipo practica
    const clase = await claseRepository.findOne({
      where: {id_clase, tipo: "practica"},
      relations: {users: true},
    });

    if (!clase) {
      return { data: null, message: "Clase práctica no encontrada", error: true };
    }

    const estudiante = await userRepository.findOne({
      where: { id: id_usuario, rol: "estudiante" },
    });

    if (!estudiante) {
      return { data: null, message: "Estudiante no encontrado", error: true };
    }

    //verificar si el estudiante no fue asignado previamente
    const fueAsignado = clase.users.some((u) => u.id === estudiante.id);
    if(fueAsignado){
      return {data : null, message: "El estudiante ya esta asignado a esa clase", error: true}
    }

    //guardar usuario asignado a clase practica
    clase.users = [...clase.users, estudiante];
    const guardar = await claseRepository.save(clase);

    return {
      data: {
        id_clase: guardar.id_clase,
        tipo: guardar.tipo,
        descripcion: guardar.descripcion,
        usuario_asignado: guardar.users.map((u) => ({
          id: u.id,
          nombre: u.nombre,
          email: u.email,
        })),
      },
      message: "Estudainte asignado a la clase practica exitosamnete",
      error: false
    };
  } catch (error) {
    console.error("Error al asignar usuario a clase práctica:", error);
    return { data: null, message: "Error interno del servidor", error: true };
  }
}

export async function getClasesConUsuarioSer(){
  try {
    const claseRepository = AppDataSource.getRepository(Clase);
    const clases = await claseRepository.find({ where: {tipo: "teorica"}, relations: {users:true} });

    if(!clases || clases.length === 0){
      return { data: null, message: "No hay clases con usuarios asignados", error:true };
    }

    const resultado = clases.map((clase) =>({
      id_clase: clase.id_clase,
      tipo: clase.tipo,
      descripcion: clase.descripcion,
      dia: clase.dia,
      hora_inicio: clase.hora_inicio,
      hora_fin: clase.hora_fin,
      usuario_asignados: clase.users?.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email
      })) ?? [],
    }));

    return { data: resultado, message: "clases con usuarios obtenidas", error:false }
  } catch (error) {
    console.error("Error al obtener clases con usuarios", error);
    return { data: null, message:"Error interno del servidor", error:true }
  }
}

export async function getClasesSer(userId, userRole) {
    try {
        const claseRepository = AppDataSource.getRepository(Clase);

        let clases;

        //filtra por id usuarios asignados

        if(userRole === "estudiante" || userRole === "estudiante"){
          clases = await claseRepository.find({
            where: { users:{id: userId}},
            relations: { profesores: true }
          });
        }else{
          clases = await claseRepository.find({
            relations: { users: true, profesores: true }
          });
        }

        //const clases = await claseRepository.find();

        if (!clases || clases.length === 0) return [null, "No hay clases"];

        return [clases, null];

    } catch (error) {
        console.error("Error al obtener las clases:", error);
        return [null, "Error interno del servidor"];
    }
}

//enviar parametros que se ingresaran en el body
export async function createClaseSer( tipo, descripcion ,fecha_clase, hora_inicio, hora_fin, dia, estado_clase, id_auto, id_profesor) {

  const claseRepository = AppDataSource.getRepository(Clase);

  try {
    if (!tipo||!descripcion||!fecha_clase||!hora_inicio || !hora_fin || !dia || !estado_clase || (id_auto !== null && !id_auto) || !id_profesor) {
      //// console.log( hora_inicio,hora_fin, dia);
      throw Error("Función mal llamada", { tipo, descripcion, fecha_clase, hora_inicio, hora_fin, dia, estado_clase, id_profesor, id_auto });
    }

    if (!id_auto) {
      id_auto = await obtenerIdVehiculoNulo();
    }

    const newClase = claseRepository.create({
      tipo, 
      descripcion,
      fecha_clase,
      hora_inicio,
      hora_fin,
      dia,
      estado_clase,
      id_profesor: Number(id_profesor),
      id_auto: Number(id_auto),
      relations: {users:true},
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
    if (!(clase.id_auto)) {
      clase.id_auto = await obtenerIdVehiculoNulo();
    }    
    // console.log(clase);
    const savedClase = await claseRepository.save(clase);
    // console.log(savedClase);
    return {data: await savedClase, message: "CLASE actualizada con éxito", error: null}
    
  }catch(error){
    console.error("Error al actualizar el horario:", error);
    return [null, "Error interno del servidor"];
  }
  
}

export async function deleteClaseSer(id_clase) {
  try{
    const claseRepository = AppDataSource.getRepository(Clase);
    const clase = await claseRepository.findOne({where: { id_clase:id_clase}, relations: {users:true}, relations: {vehiculos: true}});

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

export async function editarAsignacionLoteSer(id_clase, idsEliminar = []){
  try{
    if(!id_clase){
      return {data: null, message: "id_clase es requerido", error: true};
    }

    const userRepository = AppDataSource.getRepository(User);
    const claseRepository = AppDataSource.getRepository(Clase);

    //obtener clases

    const clase = await getClaseSer(id_clase);
    // console.log("CLASE: ", clase);

    if(!clase){
      return {data: null, message:"clase no encontrada", error: true};
    }

    //obtener estudiantes
    const estudiantes = await userRepository.find({
      where: {rol: "estudiante"},
      relations: {clase: true}
    });

    // console.log("ESTUDIANTES: ", estudiantes);
    if(!estudiantes || estudiantes.length === 0){
      return {data: null, message: "No hay estudiantes registrados", error: true}
    }

    //agregar solo los que aún no están en clase
    // console.log(clase);

    const idsExistentes = new Set(clase.users.map((u) => u.id));
    const nuevos = estudiantes.filter((u) => !idsExistentes.has(u.id));
    clase.users = [...clase.users, ...nuevos];

    if(Array.isArray(idsEliminar) && idsEliminar.length > 0){
      clase.users = clase.users.filter((u) => !idsEliminar.includes(u.id));
    }

    //guardar y retornar
    const guardar = await claseRepository.save(clase);

    return {
      data: {
        id_clase: guardar.id_clase,
        tipo: guardar.tipo,
        descripcion:guardar.descripcion,
        usuario_asignados: guardar.users.map((u)=>({
          id: u.id,
          nombre: u.nombre,
          email: u.email,
        })),
      },
      message:"Asignacion actualiazada exitosamente",
      error: false,
    }


  }catch(error){
    console.error("Error al editar asignación por lote:", error);
    return { data: null, message: "Error interno del servidor", error: true };
  };
}

/*
export async function eliminarAsignacionUsuarioSer(id_usuario) {
  try {
    if(!id_usuario){
      return {data: null, message: "id_usuario es requerido", error: true};
    }

    const usuarioId = Number(id_usuario);
    const claseRepository = AppDataSource.getRepository(Clase);

    const clases = await claseRepository.find({
      where: {users: {id: usuarioId}},
      relations: {users: true},
    });

    // // console.log(JSON.stringify(clases));

    if(!clases || clases.length === 0){
      return {data: null, message:"El usuario no esta asignado a ninguna clase ", error:true }

    }

    const desasignaciones = [];

    /*
    for(const clase of clases){
      clase.users = clase.users.filter((u) => u.id !== usuarioId);
      const guardar = await claseRepository.save(clase);

      desasignaciones.push({
        id_clase: guardar.id_clase,
        tipo: guardar.tipo,
        descripcion: guardar.descripcion,
        usuario_asignados: guardar.users.map((u) =>({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        })),
      });
    }
    for (const clase of clases) {
      const claseCompleta = await claseRepository.findOne({where: { id_clase: clase.id_clase }, relations: {users: true}});
      claseCompleta.users = claseCompleta.users.filter((u) => Number(u?.id || 0) !== usuarioId);
      try {
        const nuevaClaseCompleta = await claseRepository.save(claseCompleta);
        desasignaciones.push(nuevaClaseCompleta);
      } catch (error) {
        console.error(error);
      }
    }


    return { data:desasignaciones, message: `Usuario desasignado de ${desasignaciones.length} clase(s) exitosamente`, error: false };

  } catch (error) {
    console.error("Error al desasignar usuario: ", error);
    return { data: null, message: "Error interno del servidor", error:true}
  }
}

*/

