import * as planService from "../services/Plan.service.js";


export const crearPlan = async (req, res) => {
  try {
    const resultado = await planService.crearPlan(req.body);
    res.status(201).json({
      success: true,
      message: "Plan creado exitosamente",
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerTodosLosPlanes = async (req, res) => {
  try {
    const { estado, tipo } = req.query;
    
    let planes;
    
    if (tipo) {
      planes = await planService.obtenerPlanesPorTipo(tipo);
    } else if (estado) {
      const todosLosPlanes = await planService.obtenerTodosLosPlanes();
      planes = todosLosPlanes.filter(plan => plan.estado === estado);
    } else {
      planes = await planService.obtenerTodosLosPlanes();
    }
    
    res.status(200).json({
      success: true,
      count: planes.length,
      data: planes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerPlanPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await planService.obtenerPlanPorId(id);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

export const actualizarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await planService.actualizarPlan(id, req.body);
    res.status(200).json({
      success: true,
      message: "Plan actualizado exitosamente",
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const eliminarPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await planService.eliminarPlan(id);
    res.status(200).json({
      success: true,
      message: resultado.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};


export const cambiarEstadoPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const resultado = await planService.cambiarEstadoPlan(id, estado);
    res.status(200).json({
      success: true,
      message: `Plan ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`,
      data: resultado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerPlanesActivos = async (req, res) => {
  try {
    const planes = await planService.obtenerPlanesActivos();
    res.status(200).json({
      success: true,
      count: planes.length,
      data: planes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const obtenerPlanesPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const planes = await planService.obtenerPlanesPorTipo(tipo);
    res.status(200).json({
      success: true,
      count: planes.length,
      data: planes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};