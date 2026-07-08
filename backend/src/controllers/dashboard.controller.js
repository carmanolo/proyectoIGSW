"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Inscripcion } from "../entities/Inscripcion.entity.js";
import { Clase } from "../entities/clase.entity.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
const claseRepository = AppDataSource.getRepository(Clase);

export async function getDashboardEstudiante(req, res) {
  try {
    const userId = req.user.id;

    // Para obtener inscripciones del estudiante
    const inscripciones = await inscripcionRepository.find({
      where: { alumno: { id: userId }, estado_inscripcion: "activa" },
      relations: ["plan", "alumno"],
      order: { fecha_contratacion: "DESC" }
    });

    // Para calcular estadísticas
    const totalCursos = inscripciones.length;
    const deudasPendientes = inscripciones.filter(i => i.estado_pago === "pendiente");
    const totalDeuda = deudasPendientes.reduce((sum, i) => sum + parseFloat(i.monto_total || 0), 0);

    // Obtener próxima clase
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const proximaClase = await claseRepository.findOne({
      where: {
        usuario: { id: userId },
        fecha: hoy,
        hora_inicio: hoy
      },
      order: { hora_inicio: "ASC" }
    });

    const dashboardData = {
      cursos: inscripciones,
      deudas: deudasPendientes,
      proximaClase: proximaClase || null,
      estadisticas: {
        totalCursos,
        clasesCompletadas: 0, 
        deudasPendientes: deudasPendientes.length,
        totalDeuda,
        proximaClase: proximaClase ? `${proximaClase.hora_inicio}` : 'Sin clases'
      }
    };

    return handleSuccess(res, 200, "Dashboard cargado exitosamente", dashboardData);
  } catch (error) {
    console.error("Error en getDashboardEstudiante:", error);
    return handleErrorServer(res, 500, "Error al cargar el dashboard", error.message);
  }
}

export async function getProximaClase(req, res) {
  try {
    const userId = req.user.id;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const clase = await claseRepository.findOne({
      where: {
        usuario: { id: userId },
        fecha: hoy
      },
      order: { hora_inicio: "ASC" }
    });

    if (!clase) {
      return handleSuccess(res, 200, "No hay clases programadas para hoy", null);
    }

    return handleSuccess(res, 200, "Próxima clase encontrada", clase);
  } catch (error) {
    console.error("Error en getProximaClase:", error);
    return handleErrorServer(res, 500, "Error al obtener la próxima clase", error.message);
  }
}