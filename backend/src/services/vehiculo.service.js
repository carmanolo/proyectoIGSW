import { AppDataSource } from "../config/configDb.js";
import { SHOW_ERRORS } from "../constants/settings.constants.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

export async function createVehiculoSer(data) {
  try {
    if (data) {
      data.es_nulo = false;
    }

    if (data && data.patente) {
      data.patente = data.patente.toUpperCase();
      const patenteRegex = /^([A-Z]{2}-?[0-9]{4}|[A-Z]{4}-?[0-9]{2})$/;
      if (!patenteRegex.test(data.patente)) {
        return [null, "La patente no tiene un formato chileno válido (ej: AB1234, ABCD12)"];
      }
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
      const vehiculo = vehiculoRepository.create({id: 0, patente: "", transmision: "", estado: "", es_nulo: true});
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
    return Number(vehiculoNulo.id);
  } catch (error) {
    throw Error("Error al obtener ID del vehículo nulo: ", error);
  }
}

export async function obtenerListaVehiculos() {
  const LISTA_POR_DEFECTO = [];
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculos = await vehiculoRepository.find({where: {es_nulo: false, estado: "disponible"}});
    return vehiculos;
  } catch (error) {
    console.error(error);
    return LISTA_POR_DEFECTO;
  }
}

export async function obtenerVehiculoPorPatente(patente) { 
  try {
    if (SHOW_ERRORS) {
      // console.log("PATENTE DADA: ", patente);
    }
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOne({where: {es_nulo: false, patente: patente}});
    if (SHOW_ERRORS) {
      // console.log("¿Encontró al auto?:", JSON.stringify(vehiculo));
    }
    if (!vehiculo) {
      return null;
    }
    return vehiculo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateVehiculoSer(id, data) {
  try {
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const vehiculo = await vehiculoRepository.findOneBy({ id: Number(id) });
    
    if (!vehiculo) {
      return [null, "Vehículo no encontrado"];
    }

    if (data.patente) {
      data.patente = data.patente.toUpperCase();
      const patenteRegex = /^([A-Z]{2}-?[0-9]{4}|[A-Z]{4}-?[0-9]{2})$/;
      if (!patenteRegex.test(data.patente)) {
        return [null, "La patente no tiene un formato chileno válido (ej: AB1234, ABCD12)"];
      }
    }

    if (data.patente && data.patente !== vehiculo.patente) {
      const existe = await vehiculoRepository.findOneBy({ patente: data.patente });
      if (existe) {
        return [null, "La patente ya está registrada en otro vehículo"];
      }
    }

    if (data.patente) vehiculo.patente = data.patente;
    if (data.transmision) vehiculo.transmision = data.transmision;
    if (data.estado) vehiculo.estado = data.estado;

    await vehiculoRepository.save(vehiculo);
    return [vehiculo, null];
  } catch (error) {
    console.error("Error al actualizar vehículo:", error);
    return [null, "Error interno del servidor al actualizar vehículo"];
  }
}
