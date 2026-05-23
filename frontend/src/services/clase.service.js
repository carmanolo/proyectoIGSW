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

export async function createClaseService() {
    try {
        const response = await axios.post('/clases/crear');
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error
    }
}

export async function patchClaseService(id_clase, classData) {
    try {
        const fullData = {...classData, id_clase };
        const response = await axios.patch(`clases/`, fullData, {
            params: {id_clase},
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

//eliminar una clase

export async function deleteClaseService(id_clase) {
    try {
        const response = await axios.delete(`/clases/`,{
            params: { id_clase },
        });

        return response.data.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}