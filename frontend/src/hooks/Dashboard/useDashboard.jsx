import { useState, useEffect } from 'react';
import { getDashboardService } from '../../services/dashboard.service.js';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    cursos: [],
    deudas: [],
    proximaClase: null,
    estadisticas: {
      totalCursos: 0,
      clasesCompletadas: 0,
      deudasPendientes: 0,
      totalPagado: 0,
      proximaClase: 'Sin clases'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDashboardService();
      console.log(' Dashboard response:', response);
      if (response && response.status === 'Success' && response.data) {
        console.log(' Datos del backend (pueden estar vacíos):', response.data);

        setDashboardData({
          cursos: response.data?.cursos || [],
          deudas: response.data?.deudas || [],
          proximaClase: response.data?.proximaClase || null,
          estadisticas: {
            totalCursos: response.data?.estadisticas?.totalCursos || 0,
            clasesCompletadas: response.data?.estadisticas?.clasesCompletadas || 0,
            deudasPendientes: response.data?.estadisticas?.deudasPendientes || 0,
            totalPagado: response.data?.estadisticas?.totalDeuda || 0,
            proximaClase: response.data?.estadisticas?.proximaClase || 'Sin clases'
          }
        });
      } else {

        console.warn(' Backend falló, usando datos por defecto');
        setDashboardData({
          cursos: [],
          deudas: [],
          proximaClase: null,
          estadisticas: {
            totalCursos: 0,
            clasesCompletadas: 0,
            deudasPendientes: 0,
            totalPagado: 0,
            proximaClase: 'Sin clases'
          }
        });
      }
    } catch (err) {
      console.error(' Error en fetchDashboard:', err);
      setError(err.message || 'Error al cargar el dashboard');
      setDashboardData({
        cursos: [],
        deudas: [],
        proximaClase: null,
        estadisticas: {
          totalCursos: 0,
          clasesCompletadas: 0,
          deudasPendientes: 0,
          totalPagado: 0,
          proximaClase: 'Sin clases'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboardData, loading, error, fetchDashboard };
};

export default useDashboard;