import axios from './root.service.js';

export async function getVehiculos() {
    try {
        const response = await axios.get('/vehiculos');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener vehiculos' };
    }
}

export async function createVehiculo(vehiculoData) {
    try {
        const response = await axios.post('/vehiculos', vehiculoData);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al crear vehiculo' };
    }
}

export async function deleteVehiculo(id) {
    try {
        const response = await axios.delete(`/vehiculos/${id}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al eliminar vehiculo' };
    }
}
