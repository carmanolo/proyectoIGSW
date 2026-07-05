import axios from './root.service.js';

export async function registrarVentaService(ventaData) {
    try {
        const response = await axios.post('/ventas/pack', ventaData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function obtenerClasesUsuarioService(userId) {
    try {
        const response = await axios.get(`/ventas/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function listarVentasUsuarioService(userId) {
    try {
        const response = await axios.get(`/ventas/user/${userId}/records`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function aprobarVentaService(ventaId) {
    try {
        const response = await axios.patch(`/ventas/${ventaId}/aprobar`);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function rechazarVentaService(ventaId) {
    try {
        const response = await axios.patch(`/ventas/${ventaId}/rechazar`);
        return Object.assign(response.data, { status: response.status });
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function eliminarVentaService(ventaId) {
    try {
        const response = await axios.delete(`/ventas/${ventaId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function listarVentasService() {
    try {
        const response = await axios.get(`/ventas`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
