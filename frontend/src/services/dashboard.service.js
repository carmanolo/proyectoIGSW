import axios from './root.service.js';

export async function getDashboardService() {
  try {
    const response = await axios.get('/dashboard/estudiante');
    console.log('Dashboard data recibida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getDashboardService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener dashboard',
      data: null 
    };
  }
}

export async function getProximaClaseService() {
  try {
    const response = await axios.get('/dashboard/proxima-clase');
    return response.data;
  } catch (error) {
    console.error('Error en getProximaClaseService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener próxima clase',
      data: null 
    };
  }
}

export async function getListaEsperaService() {
  try {
    const response = await axios.get('/registro-espera/lista-espera');
    return response.data;
  } catch (error) {
    console.error('Error en getListaEsperaService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener lista de espera',
      data: [] 
    };
  }
}