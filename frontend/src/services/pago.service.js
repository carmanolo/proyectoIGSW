import axios from './root.service.js';

export async function solicitarPagoService(formData) {
  try {
    const response = await axios.post('/pagos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function listarPagosService() {
  try {
    const response = await axios.get('/pagos');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function listarMisPagosService() {
  try {
    const response = await axios.get('/pagos/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function aprobarPagoService(id) {
  try {
    const response = await axios.patch(`/pagos/${id}/aprobar`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function rechazarPagoService(id) {
  try {
    const response = await axios.patch(`/pagos/${id}/rechazar`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
