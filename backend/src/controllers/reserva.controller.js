"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createReservaSer, getReservasSer, getReservasUsuarioSer, updateReservaEstadoSer } from "../services/reserva.service.js";

export async function createReserva(req, res) {
    try {
        if(!req.body){
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { userId, vehiculoId, claseId, fecha, tipo } = req.body;
        
        if (!userId || !vehiculoId || !claseId || !fecha) {
            return handleErrorClient(res, 400, "Faltan parámetros obligatorios (userId, vehiculoId, claseId, fecha)");
        }

        if (req.user && req.user.rol === "estudiante") {
            if (Number(userId) !== Number(req.user.id)) {
                return handleErrorClient(res, 403, "No tienes permisos para agendar a otro usuario");
            }
        }

        const [nuevaReserva, error] = await createReservaSer({ userId, vehiculoId, claseId, fecha, tipo });

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return res.status(201).json({ message: "Reserva creada exitosamente", data: nuevaReserva});
    } catch (error) {
        console.error("error al crear reserva", error);
        return handleErrorServer(res, 500, "Error al crear la reserva");
    }
}

export async function getReservas(req, res) {
    try {
        const [reservas, error] = await getReservasSer();
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Reservas obtenidas", reservas);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al obtener reservas");
    }
}

export async function getReservasUsuario(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "El ID del usuario es obligatorio");
        }

        const [reservas, error] = await getReservasUsuarioSer(id);
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Reservas del usuario obtenidas", reservas);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al obtener reservas del usuario");
    }
}

export async function updateReservaEstado(req, res) {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id || !estado) {
            return handleErrorClient(res, 400, "El ID de la reserva y el estado son obligatorios");
        }

        const [reservaActualizada, error] = await updateReservaEstadoSer(id, estado);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Estado de reserva actualizado", reservaActualizada);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al actualizar estado de la reserva");
    }
}

export async function getOcupacionVehiculos(req, res) {
    try {
        const { getOcupacionVehiculosSer } = await import("../services/reserva.service.js");
        const [ocupacion, error] = await getOcupacionVehiculosSer();
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }
        
        return handleSuccess(res, 200, "Ocupación obtenida", ocupacion);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al obtener ocupación de vehículos");
    }
}
