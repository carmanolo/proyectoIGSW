import axios from './root.service.js';

// obtener clases

export async function getClasesService(){
    try {
        const response = await axios.get('/clases');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener reuniones', error);
        return [];
    }
}

//crear clases

//debo pasar una class data??????
export async function createClaseService(claseData) {
    try {
        const response = await axios.post('/clases/crear',claseData);
        return Object.assign(response.data, {status: response.status});
    } catch (error) {
        throw error.response?.data || error
    }
}

export async function patchClaseService(id_clase, claseData) {
    try {
        const response = await axios.patch(`/clases/${id_clase}`,claseData);
        return Object.assign(response.data, {status: response.status});
    } catch (error) {
        throw error.response || error;
    }
};

//eliminar una clase

export async function deleteClaseService(id_clase) {
    try {
        const response = await axios.delete(`/clases/${id_clase}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}