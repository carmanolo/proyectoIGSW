"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { registrarAsistenciaSer, getAsistenciaPorClaseSer } from "../services/asistencia.service.js";

export async function marcarAsistencia(req, res) {
    try {
        const { claseId } = req.body;
        const userId = req.user.id; // Del token

        if (!claseId) {
            return handleErrorClient(res, 400, "El ID de la clase es obligatorio");
        }

        const [asistencia, error] = await registrarAsistenciaSer(claseId, userId);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return res.status(201).json({ message: "Asistencia registrada correctamente", data: asistencia });
    } catch (error) {
        console.error("Error al registrar asistencia", error);
        return handleErrorServer(res, 500, "Error al registrar la asistencia");
    }
}

export async function getAsistenciaPorClase(req, res) {
    try {
        const { claseId } = req.params;

        if (!claseId) {
            return handleErrorClient(res, 400, "El ID de la clase es obligatorio");
        }

        const [asistencias, error] = await getAsistenciaPorClaseSer(claseId);

        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 200, "Asistencia obtenida", asistencias);
    } catch (error) {
        console.error("Error al obtener asistencia", error);
        return handleErrorServer(res, 500, "Error al obtener la asistencia de la clase");
    }
}
