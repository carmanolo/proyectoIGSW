"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Inscripcion } from "../entities/Inscripcion.entity.js";
import { Clase } from "../entities/clase.entity.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

const inscripcionRepository = AppDataSource.getRepository(Inscripcion);
const claseRepository = AppDataSource.getRepository(Clase);
const userRepository = AppDataSource.getRepository(User);

export async function getDashboardEstudiante(req, res) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const user = await userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    const inscripciones = await inscripcionRepository.find({
      where: { 
        alumno: { id: userId },
        estado_inscripcion: "activa"
      },
      relations: {
        plan: true,
        alumno: true
      },
      order: {
        fecha_contratacion: "DESC"
      }
    });

    const totalCursos = inscripciones.length;
    const deudasPendientes = inscripciones.filter(i => 
      i.estado_pago === "pendiente" || i.estado_pago === "parcial"
    );
    const totalDeuda = deudasPendientes.reduce((sum, i) => 
      sum + (parseFloat(i.monto_total || 0) - parseFloat(i.monto_pagado || 0)), 0
    );

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const proximaClase = await claseRepository.findOne({
      where: {
        users: { id: userId },  
        fecha_clase: hoy       
      },
      relations: {
        users: true,
        profesores: true,
        vehiculos: true
      },
      order: {
        hora_inicio: "ASC"
      }
    });

    const dashboardData = {
      cursos: inscripciones.map(inscripcion => ({
        id_inscripcion: inscripcion.id_inscripcion,
        plan: inscripcion.plan,
        fecha_inicio: inscripcion.fecha_inicio,
        fecha_fin: inscripcion.fecha_fin,
        estado_pago: inscripcion.estado_pago,
        estado_inscripcion: inscripcion.estado_inscripcion,
        monto_total: inscripcion.monto_total,
        monto_pagado: inscripcion.monto_pagado,
        clases_restantes: (inscripcion.clases_totales || 0) - (inscripcion.clases_tomadas || 0),
        fecha_vencimiento_pago: inscripcion.fecha_vencimiento_pago
      })),
      deudas: deudasPendientes.map(deuda => ({
        id_inscripcion: deuda.id_inscripcion,
        plan: deuda.plan,
        monto_total: deuda.monto_total,
        monto_pagado: deuda.monto_pagado || 0,
        saldo_restante: parseFloat(deuda.monto_total) - parseFloat(deuda.monto_pagado || 0),
        fecha_vencimiento_pago: deuda.fecha_vencimiento_pago,
        estado_pago: deuda.estado_pago
      })),
      proximaClase: proximaClase ? {
        id: proximaClase.id_clase,
        nombre: 'Clase de Conducción',
        fecha: proximaClase.fecha_clase,
        hora_inicio: proximaClase.hora_inicio,
        hora_fin: proximaClase.hora_fin,
        ubicacion: 'Sala Principal',
        instructor: proximaClase.profesores?.nombre || 'Por asignar',
        estado: proximaClase.estado_clase || 'pendiente'
      } : null,
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
    const userId = req.user?.id;
    
    if (!userId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const clase = await claseRepository.findOne({
      where: {
        users: { id: userId },
        fecha_clase: hoy
      },
      relations: {
        users: true,
        profesores: true,
        vehiculos: true
      },
      order: {
        hora_inicio: "ASC"
      }
    });

    if (!clase) {
      return handleSuccess(res, 200, "No hay clases programadas para hoy", null);
    }

    const claseData = {
      id: clase.id_clase,
      nombre: 'Clase de Conducción',
      fecha: clase.fecha_clase,
      hora_inicio: clase.hora_inicio,
      hora_fin: clase.hora_fin,
      ubicacion: 'Sala Principal',
      instructor: clase.profesores?.nombre || 'Por asignar',
      estado: clase.estado_clase || 'pendiente'
    };

    return handleSuccess(res, 200, "Próxima clase encontrada", claseData);
  } catch (error) {
    console.error("Error en getProximaClase:", error);
    return handleErrorServer(res, 500, "Error al obtener la próxima clase", error.message);
  }
}

export async function getMisAlumnos(req, res) {
  try {
    const profesorId = req.user?.id;
    
    if (!profesorId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    if (req.user?.rol !== 'profesor') {
      return handleErrorClient(res, 403, "Solo los profesores pueden ver sus alumnos");
    }

    const clases = await claseRepository.find({
      where: { id_profesor: profesorId },
      relations: { users: true }
    });

    console.log(' Clases del profesor:', clases.length);

    const alumnosSet = new Set();
    const alumnosList = [];

    for (const clase of clases) {
      if (clase.users && Array.isArray(clase.users)) {
        for (const user of clase.users) {
          if (!alumnosSet.has(user.id)) {
            alumnosSet.add(user.id);
            alumnosList.push({
              id: user.id,
              nombre: user.nombre || 'Sin nombre',
              rut: user.rut || 'N/A',
              email: user.email,
              telefono: user.telefono || 'N/A',
              estado: user.estado || 'activo',
              clases_tomadas: user.clases_tomadas || 0,
              progreso: user.progreso || 0
            });
          }
        }
      }
    }

    console.log(' Alumnos encontrados:', alumnosList.length);

    return handleSuccess(res, 200, "Alumnos asignados obtenidos", alumnosList);
  } catch (error) {
    console.error("Error en getMisAlumnos:", error);
    return handleErrorServer(res, 500, "Error al obtener alumnos", error.message);
  }
}

export async function getMisClases(req, res) {
  try {
    const profesorId = req.user?.id;
    
    if (!profesorId) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    // Verificar que el usuario es profesor
    if (req.user?.rol !== 'profesor') {
      return handleErrorClient(res, 403, "Solo los profesores pueden ver sus clases");
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Obtener clases del día
    const clasesHoy = await claseRepository.find({
      where: { 
        id_profesor: profesorId,
        fecha_clase: hoy
      },
      relations: { 
        users: true,
        vehiculos: true 
      },
      order: { hora_inicio: "ASC" }
    });

    // Obtener todas las clases del profesor 
    const todasLasClases = await claseRepository.find({
      where: { id_profesor: profesorId },
      relations: { users: true }
    });

    // Contar alumnos únicos
    const alumnosSet = new Set();
    for (const clase of todasLasClases) {
      if (clase.users && Array.isArray(clase.users)) {
        for (const user of clase.users) {
          alumnosSet.add(user.id);
        }
      }
    }

    const clasesFormateadas = clasesHoy.map(clase => ({
      id: clase.id_clase,
      nombre: clase.descripcion || `Clase ${clase.tipo}`,
      fecha: clase.fecha_clase,
      hora_inicio: clase.hora_inicio,
      hora_fin: clase.hora_fin,
      ubicacion: 'Sala Principal',
      estado: clase.estado_clase || 'pendiente',
      alumnos: clase.users?.length || 0,
      vehiculo: clase.vehiculos?.patente || 'Sin asignar'
    }));

    return handleSuccess(res, 200, "Clases del profesor obtenidas", {
      clasesHoy: clasesFormateadas,
      estadisticas: {
        totalClases: todasLasClases.length,
        totalAlumnos: alumnosSet.size,
        clasesHoy: clasesHoy.length
      }
    });
  } catch (error) {
    console.error("Error en getMisClases:", error);
    return handleErrorServer(res, 500, "Error al obtener clases", error.message);
  }
}