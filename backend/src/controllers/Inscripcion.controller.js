import * as inscripcionService from "../services/Inscripcion.service.js";

export const contratarPlan = async (req, res) => {
  try {
    const resultado = await inscripcionService.contratarPlan(req.body);
    res.status(201).json({
      success: true,
      message: "Plan contratado exitosamente",
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const pagarDeuda = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pago } = req.body;
    const resultado = await inscripcionService.pagarDeuda(id, monto_pago);
    res.status(200).json({
      success: true,
      message: resultado.message,
      deuda_restante: resultado.deuda_restante,
      inscripcion: resultado.inscripcion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerDeudasPendientes = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const deudas = await inscripcionService.obtenerDeudasPendientes(alumnoId);
    res.status(200).json({
      success: true,
      count: deudas.length,
      data: deudas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerInscripcionesPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const inscripciones = await inscripcionService.obtenerInscripcionesPorAlumno(alumnoId);
    res.status(200).json({
      success: true,
      count: inscripciones.length,
      data: inscripciones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const obtenerInscripcionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const inscripcion = await inscripcionService.obtenerInscripcionPorId(id);
    res.status(200).json({
      success: true,
      data: inscripcion,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

export const cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await inscripcionService.cancelarInscripcion(id);
    res.status(200).json({
      success: true,
      message: "Inscripción cancelada exitosamente",
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};