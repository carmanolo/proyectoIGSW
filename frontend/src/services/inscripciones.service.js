import axios from './root.service.js';

export async function contratarPlanService(data) {
  try {
    const response = await axios.post('/inscripciones/contratar', data);
    console.log('Contratar plan response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en contratarPlanService:', error);
    throw error.response?.data || error;
  }
}

export async function pagarDeudaService(id_inscripcion, monto_pago) {
  try {
    const response = await axios.post(`/inscripciones/${id_inscripcion}/pagar`, { monto_pago });
    return response.data;
  } catch (error) {
    console.error('Error en pagarDeudaService:', error);
    throw error.response?.data || error;
  }
}

export async function obtenerDeudasPendientesService(alumno_id) {
  try {
    const response = await axios.get(`/inscripciones/alumno/${alumno_id}/deudas`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerDeudasPendientesService:', error);
    throw error.response?.data || error;
  }
}

export async function obtenerInscripcionesPorAlumnoService(alumno_id) {
  try {
    const response = await axios.get(`/inscripciones/alumno/${alumno_id}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerInscripcionesPorAlumnoService:', error);
    throw error.response?.data || error;
  }
}

export async function obtenerInscripcionPorIdService(id_inscripcion) {
  try {
    const response = await axios.get(`/inscripciones/${id_inscripcion}`);
    return response.data;
  } catch (error) {
    console.error('Error en obtenerInscripcionPorIdService:', error);
    throw error.response?.data || error;
  }
}

export async function cancelarInscripcionService(id_inscripcion) {
  try {
    const response = await axios.put(`/inscripciones/${id_inscripcion}/cancelar`);
    return response.data;
  } catch (error) {
    console.error('Error en cancelarInscripcionService:', error);
    throw error.response?.data || error;
  }
}