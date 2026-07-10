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

export async function getMisClasesService() {
  try {
    const response = await axios.get('/dashboard/mis-clases');
    return response.data;
  } catch (error) {
    console.error('Error en getMisClasesService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener clases del profesor',
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

export async function getAlumnosAsignadosService() {
  try {
    const response = await axios.get('/dashboard/mis-alumnos');
    return response.data;
  } catch (error) {
    console.error('Error en getAlumnosAsignadosService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener alumnos asignados',
      data: [] 
    };
  }
}

export async function getDeudoresService() {
  try {
    const response = await axios.get('/dashboard/deudas');
    return response.data;
  } catch (error) {
    console.error('Error en getDeudoresService:', error);
    return {
      success: false,
      message: error.message || 'Error al obtener deudores',
      data: []
    };
  }
}

export async function getMisClasesEstudianteService() {
  try {
    const response = await axios.get('/dashboard/mis-clases-estudiante');
    return response.data;
  } catch (error) {
    console.error('Error en getMisClasesEstudianteService:', error);
    return {
      success: false,
      message: error.message || 'Error al obtener historial de clases',
      data: []
    };
  }
}

export async function getEstadisticasSecretariaService() {
  try {
    const response = await axios.get('/dashboard/estadisticas-secretaria');
    return response.data;
  } catch (error) {
    console.error('Error en getEstadisticasSecretariaService:', error);
    return {
      success: false,
      message: error.message || 'Error al obtener estadísticas',
      data: null
    };
  }
}