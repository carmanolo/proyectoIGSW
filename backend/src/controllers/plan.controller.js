import { DeudaService } from "../services/Plan.service.js";

const deudaService = new DeudaService();

export const crearPlan = async (req, res) => {
  try {
    const resultado = await deudaService.crearDeuda(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerPlanes = async (req, res) => {
  try {
    const deudas = await deudaService.obtenerTodasLasDeudas();
    res.status(200).json(deudas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPlanPorId = async (req, res) => {
  try {
    const deuda = await deudaService.obtenerDeudaPorId(req.params.id);
    res.status(200).json(deuda);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const eliminarPlan = async (req, res) => {
  try {
    const resultado = await deudaService.eliminarDeuda(req.params.id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const resultado = await deudaService.cambiarEstado(id, estado);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const pagarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pago } = req.body;
    const resultado = await deudaService.pagarPlan(id, monto_pago);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};