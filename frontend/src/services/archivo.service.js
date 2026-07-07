import axios from './root.service.js';

export const getArchivosDescargables = async () => {
  try {
    const response = await axios.get('/archivos-descargables');
    return response?.data?.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const subirArchivoDescargable = async (formData) => {
  try {
    const response = await axios.post('/archivos-descargables', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarArchivoDescargable = async (filename) => {
  try {
    const response = await axios.delete(`/archivos-descargables/${encodeURIComponent(filename)}`);
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
