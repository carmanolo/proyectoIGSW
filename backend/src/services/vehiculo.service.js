import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

export async function createVehiculoSer(data) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    
    const existe = await vehiculoRepository.findOneBy({ patente: data.patente });
    if (existe) {
      return [null, "La patente ya está registrada"];
    }

    const nuevoVehiculo = vehiculoRepository.create(data);
    await vehiculoRepository.save(nuevoVehiculo);
    return [nuevoVehiculo, null];
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    return [null, "Error interno del servidor al crear vehículo"];
  }
}

export async function getVehiculosSer() {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculos = await vehiculoRepository.find();
    return [vehiculos, null];
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return [null, "Error interno del servidor al obtener vehículos"];
  }
}

export async function deleteVehiculoSer(id) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ id: Number(id) });
    
    if (!vehiculo) {
      return [null, "Vehículo no encontrado"];
    }

    await vehiculoRepository.remove(vehiculo);
    return [true, null];
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    return [null, "Error interno del servidor al eliminar vehículo"];
  }
}
