import * as inscripcionService from "../services/Inscripcion.service.js";

export const contratarPlan = async (req, res) => {
  try {

    const { alumno_id, plan_id, fecha_inicio } = req.body;
    
    if (!alumno_id) {
      return res.status(400).json({
        success: false,
        error: "El ID del alumno es obligatorio",
      });
    }
    
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        error: "El ID del plan es obligatorio",
      });
    }
    
    if (!fecha_inicio) {
      return res.status(400).json({
        success: false,
        error: "La fecha de inicio es obligatoria",
      });
    }

    const resultado = await inscripcionService.contratarPlan(req.body);
    
    res.status(201).json({
      success: true,
      message: "Plan contratado exitosamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error en contratarPlan:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Error al contratar el plan",
    });
  }
};

export const pagarDeuda = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pago } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de inscripción inválido",
      });
    }

    if (!monto_pago || monto_pago <= 0) {
      return res.status(400).json({
        success: false,
        error: "El monto del pago debe ser mayor a 0",
      });
    }
    
    const resultado = await inscripcionService.pagarDeuda(parseInt(id), parseFloat(monto_pago));
    
    res.status(200).json({
      success: true,
      message: resultado.message,
      deuda_restante: resultado.deuda_restante,
      inscripcion: resultado.inscripcion,
    });
  } catch (error) {
    console.error("Error en pagarDeuda:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Error al realizar el pago",
    });
  }
};

export const obtenerDeudasPendientes = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    if (!alumnoId || isNaN(parseInt(alumnoId))) {
      return res.status(400).json({
        success: false,
        error: "ID de alumno inválido",
      });
    }
    
    const deudas = await inscripcionService.obtenerDeudasPendientes(parseInt(alumnoId));
    
    res.status(200).json({
      success: true,
      count: deudas.length,
      data: deudas,
    });
  } catch (error) {
    console.error("Error en obtenerDeudasPendientes:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error al obtener las deudas",
    });
  }
};

export const obtenerInscripcionesPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    if (!alumnoId || isNaN(parseInt(alumnoId))) {
      return res.status(400).json({
        success: false,
        error: "ID de alumno inválido",
      });
    }
    
    const inscripciones = await inscripcionService.obtenerInscripcionesPorAlumno(parseInt(alumnoId));
    
    res.status(200).json({
      success: true,
      count: inscripciones.length,
      data: inscripciones,
    });
  } catch (error) {
    console.error("Error en obtenerInscripcionesPorAlumno:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error al obtener las inscripciones",
    });
  }
};

export const obtenerInscripcionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de inscripción inválido",
      });
    }
    
    const inscripcion = await inscripcionService.obtenerInscripcionPorId(parseInt(id));
    
    res.status(200).json({
      success: true,
      data: inscripcion,
    });
  } catch (error) {
    console.error("Error en obtenerInscripcionPorId:", error);
    res.status(404).json({
      success: false,
      error: error.message || "Inscripción no encontrada",
    });
  }
};

export const cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "ID de inscripción inválido",
      });
    }
    
    const resultado = await inscripcionService.cancelarInscripcion(parseInt(id));
    
    res.status(200).json({
      success: true,
      message: "Inscripción cancelada exitosamente",
      data: resultado,
    });
  } catch (error) {
    console.error("Error en cancelarInscripcion:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Error al cancelar la inscripción",
    });
  }
};