import { useState, useEffect } from 'react';
import { getDashboardService } from '../../services/dashboard.service.js';

// DATOS DE EJEMPLO por ahora 
const DATOS_EJEMPLO_ESTUDIANTE = {
  cursos: [
    {
      id_inscripcion: 1,
      plan: { 
        nombre: 'Curso Básico de Conducción',
        tipo: 'teorico'
      },
      fecha_inicio: '2024-01-15',
      estado_pago: 'pagado',
      estado_inscripcion: 'activa',
      clases_restantes: 5
    },
    {
      id_inscripcion: 2,
      plan: { 
        nombre: 'Curso Avanzado',
        tipo: 'practico'
      },
      fecha_inicio: '2024-02-01',
      estado_pago: 'pendiente',
      estado_inscripcion: 'activa',
      clases_restantes: 8
    }
  ],
  deudas: [
    {
      id_inscripcion: 2,
      plan: { nombre: 'Curso Avanzado' },
      monto_total: 45000,
      monto_pagado: 0,
      fecha_vencimiento_pago: '2024-03-01',
      estado_pago: 'pendiente'
    }
  ],
  proximaClase: {
    nombre: 'Clase Práctica de Conducción',
    fecha: '2024-07-08',
    hora_inicio: '10:00',
    hora_fin: '11:30',
    ubicacion: 'Sala 101 - Pista de Conducción',
    instructor: 'Juan Pérez',
    estado: 'pendiente'
  },
  estadisticas: {
    totalCursos: 2,
    clasesCompletadas: 3,
    deudasPendientes: 1,
    totalPagado: 0,
    proximaClase: '10:00 AM'
  }
};

export const useDashboard = () => {

  const [dashboardData, setDashboardData] = useState(DATOS_EJEMPLO_ESTUDIANTE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDashboardService();
      console.log('Dashboard response:', response);
      
      if (response && response.success && response.data) {
   
        setDashboardData({
          cursos: response.data?.cursos || [],
          deudas: response.data?.deudas || [],
          proximaClase: response.data?.proximaClase || null,
          estadisticas: {
            totalCursos: response.data?.estadisticas?.totalCursos || 0,
            clasesCompletadas: response.data?.estadisticas?.clasesCompletadas || 0,
            deudasPendientes: response.data?.estadisticas?.deudasPendientes || 0,
            totalPagado: response.data?.estadisticas?.totalPagado || 0,
            proximaClase: response.data?.estadisticas?.proximaClase || 'Sin clases'
          }
        });
      } else {
  
        console.log('No hay datos del backend, usando datos de ejemplo');
        setDashboardData(DATOS_EJEMPLO_ESTUDIANTE);
      }
    } catch (err) {
      console.error('Error en fetchDashboard:', err);
      setError(err.message || 'Error al cargar el dashboard');
      
      setDashboardData(DATOS_EJEMPLO_ESTUDIANTE);
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