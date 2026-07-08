//esto todavia no funciona de traer datos desde el backend 

import axios from './root.service.js';

export async function getDashboardService() {
  try {
    const response = await axios.get('/dashboard/estudiante');
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
    const response = await axios.get('/registro/lista-espera');
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

export async function getDesempenoService() {
  try {
    const response = await axios.get('/dashboard/desempeno');
    return response.data;
  } catch (error) {
    console.error('Error en getDesempenoService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener desempeño',
      data: null 
    };
  }
}

export async function getAlumnosConDeudasService() {
  try {
    const response = await axios.get('/dashboard/alumnos-deudas');
    return response.data;
  } catch (error) {
    console.error('Error en getAlumnosConDeudasService:', error);
    return { 
      success: false, 
      message: error.message || 'Error al obtener alumnos con deudas',
      data: [] 
    };
  }
}