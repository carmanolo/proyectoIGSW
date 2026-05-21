"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { createReservaSer, getReservasSer } from "../services/reserva.service.js";

export async function createReserva(req, res) {
    try {
        if(!req.body){
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { userId, vehiculoId, horarioId, fecha, tipo } = req.body;
        
        if (!userId || !vehiculoId || !horarioId || !fecha) {
            return handleErrorClient(res, 400, "Faltan parámetros obligatorios (userId, vehiculoId, horarioId, fecha)");
        }

        const [nuevaReserva, error] = await createReservaSer({ userId, vehiculoId, horarioId, fecha, tipo });

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
