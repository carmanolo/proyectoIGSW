import axios from './root.service.js';

export async function createIncidenciaService(data) {
  try {
    const response = await axios.post('/incidencias', data);
    return Object.assign(response.data, { status: response.status });
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getIncidenciasService(params = {}) {
  try {
    const response = await axios.get('/incidencias', { params });
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function updateIncidenciaStatusService(id, estado) {
  try {
    const response = await axios.patch(`/incidencias/${id}/estado`, { estado });
    return Object.assign(response.data, { status: response.status });
  } catch (error) {
    throw error.response?.data || error;
  }
}
