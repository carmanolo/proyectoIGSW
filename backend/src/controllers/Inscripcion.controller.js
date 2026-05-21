import { InscripcionService } from "../services/Inscripcion.service.js";

const inscripcionService = new InscripcionService();


export const contratarPlan = async (req, res) => {
  try {
    const resultado = await inscripcionService.contratarPlan(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const pagarDeuda = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pago } = req.body;
    const resultado = await inscripcionService.pagarDeuda(id, monto_pago);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const obtenerDeudasPendientes = async (req, res) => {
  try {
    const deudas = await inscripcionService.obtenerDeudasPendientes(req.params.alumnoId);
    res.status(200).json(deudas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const obtenerInscripcionesPorAlumno = async (req, res) => {
  try {
    const inscripciones = await inscripcionService.obtenerInscripcionesPorAlumno(req.params.alumnoId);
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const cancelarInscripcion = async (req, res) => {
  try {
    const resultado = await inscripcionService.cancelarInscripcion(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};