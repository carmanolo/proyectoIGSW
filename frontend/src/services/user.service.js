import axios from './root.service.js';

export async function CreateUser(usersData) {
  try {
    console.log('Enviando datos al backend:', usersData);
    const response = await axios.post('/usuarios/crear', usersData);
    console.log(' Respuesta del backend:', response.data);
    return Object.assign(response.data, { status: response.status });
  } catch (error) {
    console.error(' Error en CreateUser:', error);
    console.error(' Detalles del error:', error.response?.data);
    
    if (error.response) {
      throw error.response.data;
    }
    throw { message: error.message || 'Error al crear usuario' };
  }
}

export async function getUser() {
  try {
    const response = await axios.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error('Error en GetUsers:', error);
    throw error.response?.data || { message: 'Error al obtener usuarios' };
  }
}


export async function UpdateUser(id, data) {
  try {
    const response = await axios.patch(`/usuarios/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error en UpdateUser:', error);
    throw error.response?.data || { message: 'Error al actualizar usuario' };
  }
}

export async function DeleteUser(id) {
  try {
    const response = await axios.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en DeleteUser:', error);
    throw error.response?.data || { message: 'Error al eliminar usuario' };
  }
}