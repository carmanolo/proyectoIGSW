"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createVehiculoSer, getVehiculosSer, deleteVehiculoSer, obtenerListaVehiculos, updateVehiculoSer } from "../services/vehiculo.service.js";
import { procesarVehiculos } from "../utils/vehiculo.utils.js";

export async function createVehiculo(req, res) {
    try {
        if(!req.body){
            return res.status(400).json({ message: "Datos no proporcionados"});
        }
        
        const { patente, transmision } = req.body;
        
        if (!patente || !transmision) {
            return handleErrorClient(res, 400, "Patente y transmision son requeridos");
        }

        if (transmision !== "mecanico" && transmision !== "automatico") {
            return handleErrorClient(res, 400, "Transmisión inválida (mecanico/automatico)");
        }

        const [nuevoVehiculo, error] = await createVehiculoSer({ patente, transmision });

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return res.status(201).json({ message: "Vehículo registrado exitosamente", data: nuevoVehiculo});
    } catch (error) {
        console.error("error en registro de vehiculo", error);
        return handleErrorServer(res, 500, "Error al registrar vehículo");
    }
}

export async function getVehiculos(req, res) {
    try {
        const [vehiculos, error] = await getVehiculosSer();
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Vehículos obtenidos", vehiculos);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al obtener vehículos");
    }
}

export async function deleteVehiculo(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "ID requerido");
        }

        const [result, error] = await deleteVehiculoSer(id);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Vehículo eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error al eliminar vehículo");
    }
}

export async function getVehiculoList(req, res) {
    const DEFAULT_ARRAY = [];
    try {
        let vehiculoList = await obtenerListaVehiculos();
        vehiculoList = procesarVehiculos(vehiculoList);
        return handleSuccess(res, 200, "Vehiculos encontrados con éxito", vehiculoList);
    } catch (error) {
        console.error(error);
        return handleSuccess(res, 200, "Error al obtener vehiculos; disimular", DEFAULT_ARRAY);
    }
}

export async function updateVehiculo(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "ID requerido");
        }

        const { patente, transmision, estado } = req.body;
        
        if (transmision && transmision !== "mecanico" && transmision !== "automatico") {
            return handleErrorClient(res, 400, "Transmisión inválida (mecanico/automatico)");
        }

        const [vehiculo, error] = await updateVehiculoSer(id, { patente, transmision, estado });

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Vehículo actualizado exitosamente", vehiculo);
    } catch (error) {
        console.error("error al actualizar vehiculo", error);
        return handleErrorServer(res, 500, "Error al actualizar vehículo");
    }
}
