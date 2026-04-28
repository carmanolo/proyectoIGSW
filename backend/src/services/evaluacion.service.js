import { AppDataSource } from "../config/configDb.js";
import { vehiculo } from "../entities/vehiculo.entity.js";

export async function V({id_vehiculo}) {
    try{
        const vehiculoRepository = AppDataSource.getVehiculoSer(vehiculo);

        const vehiculoFound = await vehiculoRepository.findOne({
            where: [{ id_vehiculo: id_vehiculo}]
        })

        if(!vehiculoFound) return [null, "vehiculo no encontrado"]

    }catch(error){
        console.error("Error al obtener el vehiculo", error)
        return [null, "Error interno del servidor"]
    }
}

export async function getVehiculoSer() {
    try {
        const vehiculoRepository = AppDataSource.getRepository(vehiculo);

        const vehiculo = await vehiculoRepository.find();

        if (!vehiculo || vehiculo.length === 0) return [null, "No hay vehiculos"];

        return [vehiculo, null];

    } catch (error) {
        console.error("Error al obtener los vehiculos", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createVehiculoSer(id_vehiculo,patente,tipo,estado,p_asignado_garantia,actualizado) {

  const vehiculoRepository = AppDataSource.getRepository(vehiculo);

  try {
    if (!id_vehiculo || !patente || !tipo || !estado || !p_asignado || !garantia || !actualizado) {
      throw Error("Función mal llamada", {id_vehiculo, patente, tipo, estado, p_asignado, garantia, actualizado})
    }
    const newVehiculo = vehiculoRepository.create({
      id_vehiculo,
      patente,
      tipo,
      estado,
      p_asignado,
      garantia,
      actualizado,
    });
    await vehiculoRepository.save(newVehiculo);
    return newVehiculo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateVehiculoSer(vehiculo) {
  try{
    if(!vehiculo){
      throw new Error("Funcion mal llamada");
    }

    return {data: await vehiculoRepository.save(vehiculo), message: "vehiculo actualizado con éxito", error: null}
    
  }catch(error){
    console.error("Error al actualizar el vehiculo:", error);
    return [null, "Error interno del servidor"];
  }
  
}

export async function deleteVehiculo(id_vehiculo) {
  try{
    const vehiculoRepository = AppDataSource.getRepository(vehiculo);
    const vehiculo = await vehiculoRepository.findOne({where: { id_vehiculo:id_vehiculo}});

    if(!vehiculo){
      return { result: null, message: "Vehiculo no encontrado"}
    }

    return{
      result: (await vehiculoRepository.delete({id_vehiculo: vehiculo.id_vehiculo})),
      message: "vehiculo eliminado exitosamente"
    };
  } catch (error){
    console.error(error);
    return { result: null, message: "Error al eliminar el vehiculo" };
  }
}




