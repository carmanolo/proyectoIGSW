"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createVehiculoSer, getVehiculoSer, getVehiculosSer, updateVehiculoSer, deleteVehiculo } from "../services/vehiculo.service.js";

export async function asignarVehiculo(req, res) {
    try {
        let newVehiculo = null;
        if(!req.body || req.params){
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { placa, marca } = req.body;

        if(newVehiculo = await createVehiculoSer(placa, marca)){
            return res.status(201).json({ message: "Vehiculo registrado exitosamente",data:newVehiculo});
        }else{
            return res.status(500).json({message: "Error al registrar vehiculo"})
        }
    } catch (error) {
        console.error("error en registro de vehiculo", error);
        return res.status(500).json({ message: "Error al registrar el vehiculo"});
    }
}

export async function getVehiculo(req, res) {
    const vehiculoData = await getVehiculosSer();
    if(!vehiculoData){
        return handleErrorClient(res, 400, "Vehiculos no encontrados");
    }
}

export async function patchVehiculo(req, res) {
    try {
        if (!req || !req.params || !req.body) {
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "El ID del vehiculo es obligatorio" });
        }

        const vehiculoUpdate = await getVehiculoSer(id);

        if(!vehiculoUpdate){
            return handleErrorClient(res, 404, "Vehiculo no encontrado");
        }

        const updatedVehiculo = await updateVehiculoSer(vehiculoUpdate);
        if(!(vehiculoUpdate.data)){
            if(!vehiculoUpdate.error){
                return handleErrorClient(res, 500, vehiculoUpdate.message);
            }
            return handleErrorClient(res, 400, vehiculoUpdate.message);
        }
        return handleSuccess(res, 200, "Vehiculo actualizado con éxito", vehiculoUpdate.data);

    } catch (error) {
        return handleErrorServer(res, 500, "error interno del servidor")
    }
    
}

export async function deleteVehiculo(req, res) {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "El ID del vehiculo es obligatorio"});
        }

        const result = await deleteVehiculo(id);
        if(result && result.result && result.result.affected >=1){
            return handleSuccess(res, 200, "Vehiculo eliminado exitosamente")
        }

        /*if (result.message === VEHICULO_NO_ENCONTRADO) {
            return handleErrorClient(res, 404, result.message, result.result);
        }*/

        return handleErrorClient(res, 400, result.message, result.result);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al eliminar el vehiculo", error.message);
    }
}
