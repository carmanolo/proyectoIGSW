"use strict";
import { AppDataSource } from "../config/configDb.js";
import Asistencia from "../entities/asistencia.entity.js";
import Reserva from "../entities/reserva.entity.js";

const asistenciaRepository = AppDataSource.getRepository(Asistencia);
const reservaRepository = AppDataSource.getRepository(Reserva);

export async function registrarAsistenciaSer(claseId, userId) {
    try {
        // Verificar si el alumno tiene una reserva o está asignado a la clase
        const reservaExistente = await reservaRepository.findOne({
            where: { user: { id: userId }, clase: { id_clase: claseId } }
        });

        const claseRepository = AppDataSource.getRepository(Clase);
        const claseExistente = await claseRepository.findOne({
            where: { id_clase: claseId },
            relations: { users: true }
        });

        const estaAsignado = claseExistente && claseExistente.users.some(u => Number(u.id) === Number(userId));

        if (!reservaExistente && !estaAsignado) {
            return [null, "No tienes una reserva ni estás asignado a esta clase."];
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

        // Opcional: Actualizar el estado de la reserva a "completada" si existe
        if (reservaExistente) {
            reservaExistente.estado = "completada";
            await reservaRepository.save(reservaExistente);
        }

        return [nuevaAsistencia, null];
    } catch (error) {
        console.error("Error en registrarAsistenciaSer: ", error);
        return [null, "Error interno del servidor al registrar asistencia"];
    }
}

export async function getAsistenciaPorClaseSer(claseId) {
    try {
        const claseRepository = AppDataSource.getRepository(Clase);
        const clase = await claseRepository.findOne({
            where: { id_clase: claseId },
            relations: { users: true }
        });

        const reservas = await reservaRepository.find({
            where: { clase: { id_clase: claseId } },
            relations: ["user"]
        });

        const asistencias = await asistenciaRepository.find({
            where: { clase: { id_clase: claseId } },
            relations: ["user"]
        });

        const asistenciaMap = new Set(asistencias.map(a => a.user.id));
        const usuariosSet = new Map();

        reservas.forEach(reserva => {
            usuariosSet.set(reserva.user.id, {
                alumnoId: reserva.user.id,
                nombre: reserva.user.nombre,
                email: reserva.user.email,
                presente: asistenciaMap.has(reserva.user.id)
            });
        });

        if (clase && clase.users) {
            clase.users.forEach(u => {
                if (!usuariosSet.has(u.id)) {
                    usuariosSet.set(u.id, {
                        alumnoId: u.id,
                        nombre: u.nombre,
                        email: u.email,
                        presente: asistenciaMap.has(u.id)
                    });
                }
            });
        }

        const resultado = Array.from(usuariosSet.values());

        return [resultado, null];
    } catch (error) {
        console.error("Error en getAsistenciaPorClaseSer: ", error);
        return [null, "Error interno del servidor al obtener asistencias"];
    }
}
