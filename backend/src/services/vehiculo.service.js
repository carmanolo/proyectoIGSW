import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

export async function createVehiculoSer(data) {
  try {
    if (data) {
      data.es_nulo = false;
    }
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
    const vehiculos = await vehiculoRepository.find({where: {es_nulo: false}});
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
    if (vehiculo.es_nulo) {
      return [null, "Vehículo no encontrado"];
    }

    await vehiculoRepository.remove(vehiculo);
    return [true, null];
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    return [null, "Error interno del servidor al eliminar vehículo"];
  }
}

async function obtenerCantidadVehiculosNulos() {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const cantidadVehiculosNulos = await vehiculoRepository.count({where: {es_nulo: true}});
    return cantidadVehiculosNulos;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function obtenerVehiculoNulo() {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculoNulo = await vehiculoRepository.findOne({where: {es_nulo: true}});
    if (!vehiculoNulo) {
      return null;
    }
    return vehiculoNulo;
  } catch (error) {
    console.error(error);
    return null;
  }  
}

export async function crearVehiculoNulo() {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const cantidadVehiculosNulos = await obtenerCantidadVehiculosNulos();
    if (cantidadVehiculosNulos > 1) {
      throw Error("Solo puede haber un solo vehículo nulo");
    }
    if (cantidadVehiculosNulos < 1) {
      const vehiculo = vehiculoRepository.create({id_auto: 0, patente: "", transmision: "", estado: "", es_nulo: true});
      await vehiculoRepository.save(vehiculo);
    }
    if (cantidadVehiculosNulos === 1) {
      return;
    }
  } catch (error) {
    throw Error("Error al crear vehículo nulo: ", error);
  }
}

export async function obtenerIdVehiculoNulo() {
  try {
    const vehiculoNulo = await obtenerVehiculoNulo();
    if (vehiculoNulo === null) {
      throw Error("No existe el vehículo nulo");
    }
    return Number(vehiculoNulo.id_auto);
  } catch (error) {
    throw Error("Error al obtener ID del vehículo nulo: ", error);
  }
}

export async function obtenerListaVehiculos() {
  const LISTA_POR_DEFECTO = [];
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculos = await vehiculoRepository.find({where: {es_nulo: false}});
    return vehiculos;
  } catch (error) {
    console.error(error);
    return LISTA_POR_DEFECTO;
  }
}