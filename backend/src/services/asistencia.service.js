"use strict";
import { AppDataSource } from "../config/configDb.js";
import Asistencia from "../entities/asistencia.entity.js";
import Reserva from "../entities/reserva.entity.js";

const asistenciaRepository = AppDataSource.getRepository(Asistencia);
const reservaRepository = AppDataSource.getRepository(Reserva);

export async function registrarAsistenciaSer(claseId, userId) {
    try {
        // Verificar si el alumno tiene una reserva (clase regular) para esa clase y ese día
        // Aquí podríamos validar el estado de la reserva, pero lo haremos de manera simple:
        // si existe una reserva para ese userId y claseId.
        const reservaExistente = await reservaRepository.findOne({
            where: { user: { id: userId }, clase: { id_clase: claseId } }
        });

        if (!reservaExistente) {
            return [null, "No tienes una reserva para esta clase."];
        }

        // Verificar si ya registró asistencia
        const asistenciaExistente = await asistenciaRepository.findOne({
            where: { user: { id: userId }, clase: { id_clase: claseId } }
        });

        if (asistenciaExistente) {
            return [null, "Ya registraste tu asistencia para esta clase."];
        }

        // Crear la asistencia
        const nuevaAsistencia = asistenciaRepository.create({
            user: { id: userId },
            clase: { id_clase: claseId }
        });

        await asistenciaRepository.save(nuevaAsistencia);

        // Opcional: Actualizar el estado de la reserva a "completada" si es que así se desea.
        reservaExistente.estado = "completada";
        await reservaRepository.save(reservaExistente);

        return [nuevaAsistencia, null];
    } catch (error) {
        console.error("Error en registrarAsistenciaSer: ", error);
        return [null, "Error interno del servidor al registrar asistencia"];
    }
}

export async function getAsistenciaPorClaseSer(claseId) {
    try {
        // Obtener a todos los que tienen reserva para esa clase y ver si están en la tabla de asistencia
        const reservas = await reservaRepository.find({
            where: { clase: { id_clase: claseId } },
            relations: ["user"]
        });

        const asistencias = await asistenciaRepository.find({
            where: { clase: { id_clase: claseId } },
            relations: ["user"]
        });

        const asistenciaMap = new Set(asistencias.map(a => a.user.id));

        const resultado = reservas.map(reserva => ({
            alumnoId: reserva.user.id,
            nombre: reserva.user.nombre,
            email: reserva.user.email,
            presente: asistenciaMap.has(reserva.user.id)
        }));

        return [resultado, null];
    } catch (error) {
        console.error("Error en getAsistenciaPorClaseSer: ", error);
        return [null, "Error interno del servidor al obtener asistencias"];
    }
}
