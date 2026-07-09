
import { getClasesService } from "@services/clase.service.js";

export const useGetClase = (claseData, setClaseData) => {
    const fetchClase = async () => {
        try {
            const data = await getClasesService();
            // data ya es directamente el arreglo de clases (o un arreglo vacío)
            setClaseData(data || []);
        } catch (error) {
            console.error('Error al conseguir la clase data:', error);
        }
    };


    return [claseData, fetchClase];
};

export default useGetClase;