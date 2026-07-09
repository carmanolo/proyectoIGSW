import { useState, useEffect } from 'react';
import { getProximaClaseService } from '../../services/dashboard.service.js';

export const useProximaClase = () => {
  const [proximaClase, setProximaClase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProximaClase = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getProximaClaseService();
      console.log(' Próxima clase response:', response);
      

      if (response && response.status === 'Success') {
        setProximaClase(response.data || null);
        console.log(' Próxima clase:', response.data || 'No hay clase');
      } else {
        setProximaClase(null);
      }
    } catch (err) {
      console.error(' Error en fetchProximaClase:', err);
      setError(err.message);
      setProximaClase(null);
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