import { useState, useEffect } from 'react';
import { getProximaClaseService } from '../../services/dashboard.service.js';

// DATOS DE EJEMPLO
const CLASE_EJEMPLO = {
  nombre: 'Clase Práctica de Conducción',
  fecha: '2024-07-08',
  hora_inicio: '10:00',
  hora_fin: '11:30',
  ubicacion: 'Sala 101 - Pista de Conducción',
  instructor: 'Juan Pérez',
  estado: 'pendiente'
};

export const useProximaClase = () => {
  const [proximaClase, setProximaClase] = useState(CLASE_EJEMPLO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProximaClase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProximaClaseService();
      console.log('Próxima clase response:', response);
      
      if (response && response.success && response.data) {
        setProximaClase(response.data);
      } else {
     
        setProximaClase(CLASE_EJEMPLO);
      }
    } catch (err) {
      console.error('Error en fetchProximaClase:', err);
      setError(err.message);
     
      setProximaClase(CLASE_EJEMPLO);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProximaClase();
  }, []);

  return { proximaClase, loading, error, fetchProximaClase };
};

export default useProximaClase;