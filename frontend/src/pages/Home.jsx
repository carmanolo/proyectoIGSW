import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDashboard from '@hooks/Dashboard/useDashboard';
import useProximaClase from '@hooks/Dashboard/useProximaClase';
import { ProximaClaseCard } from '@components/dashboard/ProximaClaseCard';
import { DeudasCard } from '@components/dashboard/DeudasCard';
import { MisCursosCard } from '@components/dashboard/MisCursosCard';
import { EstadisticasCard } from '@components/dashboard/EstadisticasCard';
import { GraficoDesempeno } from '@components/dashboard/GraficoDesempeno';
import { AccesoRapidoCard } from '@components/dashboard/AccessoRapidoCard';
import { ProfesorResumen } from '@components/dashboard/ProfesorResumen';
import { MisAlumnosCard } from '@components/dashboard/MisAlumnosCard';
import { AlumnosConDeudasCard } from '@components/dashboard/AlumnosConDeudasCard';
import { ListaEsperaCard } from '@components/dashboard/ListaEsperaCard';
import { useContratarPlan } from '@hooks/Planes/useContratarPlan';
import { usePagarDeuda } from '@hooks/Inscripciones/usePagarDeuda';
import { getListaEsperaService } from '@services/registro.service.js';
import { getAlumnosAsignadosService, getMisClasesService } from '@services/dashboard.service.js';
import Swal from 'sweetalert2';
import { 
  Clock, Calendar, ChevronRight, Sparkles, 
  GraduationCap, DollarSign, Users, UserCheck 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { dashboardData, loading, fetchDashboard } = useDashboard();
  const { proximaClase, loading: loadingClase } = useProximaClase();
  const { handleContratarPlan } = useContratarPlan(user?.id, fetchDashboard);
  const { handlePagarDeuda } = usePagarDeuda(fetchDashboard);

  // Estado para solicitudes en espera (secretaría)
  const [solicitudesEspera, setSolicitudesEspera] = useState([]);
  const [loadingEspera, setLoadingEspera] = useState(false);

  // Estado para profesor
  const [clasesProfesorData, setClasesProfesorData] = useState([]);
  const [alumnosAsignadosData, setAlumnosAsignadosData] = useState([]);
  const [loadingProfesor, setLoadingProfesor] = useState(false);

  const rol = user?.rol?.toLowerCase() || 'estudiante';
  const esEstudiante = rol === 'estudiante';
  const esProfesor = rol === 'profesor';
  const esSecretaria = rol === 'secretaria' || rol === 'secretario';
  const esAdmin = rol === 'administrador';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cargar solicitudes en espera (solo para secretaría)
  useEffect(() => {
    if (esSecretaria) {
      cargarSolicitudesEspera();
    }
  }, [esSecretaria]);

  // Cargar datos del profesor
  useEffect(() => {
    if (esProfesor) {
      cargarDatosProfesor();
    }
  }, [esProfesor]);

  // Cargar solicitudes en espera
  const cargarSolicitudesEspera = async () => {
    setLoadingEspera(true);
    try {
      const response = await getListaEsperaService();
      console.log(' Solicitudes en espera:', response);
      if (response && response.status === 'Success') {
        setSolicitudesEspera(response.data || []);
      } else {
        setSolicitudesEspera([]);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setSolicitudesEspera([]);
    } finally {
      setLoadingEspera(false);
    }
  };

  // Cargar datos del profesor
  const cargarDatosProfesor = async () => {
    setLoadingProfesor(true);
    try {
      // Obtener clases del profesor
      const clasesResponse = await getMisClasesService();
      console.log('📚 Clases del profesor:', clasesResponse);
      
      // Obtener alumnos asignados al profesor
      const alumnosResponse = await getAlumnosAsignadosService();
      console.log(' Alumnos asignados:', alumnosResponse);
      
      // Procesar clases
      if (clasesResponse && clasesResponse.status === 'Success') {
        const clasesData = clasesResponse.data;
        // Si tiene clasesHoy, usarlas; si no, usar todas las clases
        const clasesList = clasesData.clasesHoy || clasesData || [];
        setClasesProfesorData(clasesList);
      } else {
        setClasesProfesorData([]);
      }
      
      // Procesar alumnos
      if (alumnosResponse && alumnosResponse.status === 'Success') {
        setAlumnosAsignadosData(alumnosResponse.data || []);
      } else {
        setAlumnosAsignadosData([]);
      }
      
    } catch (error) {
      console.error('Error al cargar datos del profesor:', error);
      setClasesProfesorData([]);
      setAlumnosAsignadosData([]);
    } finally {
      setLoadingProfesor(false);
    }
  };

  // Verificar solicitud (aprobar/rechazar)
  const handleVerificarSolicitud = async (id, estado) => {
    try {
      const { verificarRegistroService } = await import('@services/registro.service.js');
      
      const actionText = estado === 'verificado' ? 'aprobar' : 'rechazar';
      
      const result = await Swal.fire({
        title: `¿${estado === 'verificado' ? 'Aprobar' : 'Rechazar'} solicitud?`,
        text: `¿Estás seguro de ${actionText} esta solicitud?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: `Sí, ${actionText}`,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: estado === 'verificado' ? '#10B981' : '#EF4444',
      });

      if (!result.isConfirmed) return;

      const { value: observaciones } = await Swal.fire({
        title: 'Observaciones (opcional)',
        input: 'textarea',
        inputPlaceholder: 'Escribe alguna observación...',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Saltar',
        inputValidator: (value) => {
          if (value && value.length > 500) {
            return 'Las observaciones no pueden tener más de 500 caracteres';
          }
        }
      });

      const response = await verificarRegistroService(id, {
        estado,
        observaciones: observaciones || null
      });

      if (response && response.status === 'Success') {
        await Swal.fire({
          title: '¡Éxito!',
          text: response.message || 'Solicitud procesada correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        cargarSolicitudesEspera();
        fetchDashboard();
      } else {
        throw new Error(response?.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al verificar:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar la solicitud',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Datos de ejemplo para secretaría (fallback)
  const alumnosConDeudas = [
    { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', deuda: 45000, estado_pago: 'Pendiente' },
    { id: 2, nombre: 'María González', rut: '98.765.432-1', deuda: 32000, estado_pago: 'Pendiente' },
  ];

  // Formatear clases para el componente ProfesorResumen
  const formatearClasesProfesor = () => {
    if (!clasesProfesorData || clasesProfesorData.length === 0) {
      return [];
    }
    
    return clasesProfesorData.map(clase => ({
      nombre: clase.nombre || clase.descripcion || `Clase ${clase.tipo || 'General'}`,
      hora_inicio: clase.hora_inicio,
      hora_fin: clase.hora_fin,
      ubicacion: clase.ubicacion || 'Sala Principal',
      estado: clase.estado || 'Pendiente'
    }));
  };

  // Formatear alumnos para el componente MisAlumnosCard
  const formatearAlumnos = () => {
    if (!alumnosAsignadosData || alumnosAsignadosData.length === 0) {
      return [];
    }
    
    return alumnosAsignadosData.map(alumno => ({
      id: alumno.id,
      nombre: alumno.nombre,
      rut: alumno.rut || 'N/A',
      estado: alumno.estado || 'activo'
    }));
  };

  // Renderizar contenido según el rol
  const renderContenidoIzquierda = () => {
    if (esEstudiante) {
      return (
        <>
          {/* PRÓXIMA CLASE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h2>Próxima Clase</h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <ProximaClaseCard 
              clase={proximaClase || dashboardData.proximaClase}
              loading={loadingClase || loading}
            />
          </div>

          {/* MIS CURSOS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <h2>Mis Cursos</h2>
              </div>
              <button 
                onClick={() => handleContratarPlan()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1.5 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                + Contratar Plan
              </button>
            </div>
            <MisCursosCard 
              cursos={dashboardData.cursos} 
              loading={loading}
              rol={rol}
            />
          </div>
        </>
      );
    }

    if (esProfesor) {
      const clasesFormateadas = formatearClasesProfesor();
      
      return (
        <>
          {/* SIGUIENTE CLASE */}
          <ProfesorResumen 
            clases={clasesFormateadas.length > 0 ? clasesFormateadas : [
              { nombre: 'No hay clases programadas', hora_inicio: '--:--', hora_fin: '--:--', ubicacion: '---', estado: 'Sin clases' }
            ]}
            loading={loadingProfesor}
          />

          {/* CURSOS A CARGO */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <h2>Cursos a Cargo</h2>
              </div>
            </div>
            <MisCursosCard 
              cursos={clasesProfesorData.map(clase => ({
                id_inscripcion: clase.id || clase.id_clase || Math.random(),
                plan: { 
                  nombre: `${clase.tipo?.toUpperCase() || 'Curso'} - ${clase.descripcion || clase.nombre || 'Sin descripción'}`,
                  tipo: clase.tipo || 'General'
                },
                fecha_inicio: clase.fecha_clase || new Date().toISOString().split('T')[0],
                estado_pago: 'pagado',
                estado_inscripcion: clase.estado || 'activa',
                clases_restantes: 0
              }))}
              loading={loadingProfesor}
              rol={rol}
            />
          </div>
        </>
      );
    }

    if (esSecretaria) {
      return (
        <>
          {/* ÚLTIMAS SOLICITUDES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <Users className="w-5 h-5 text-yellow-500" />
                <h2>Últimas Solicitudes</h2>
              </div>
              <button 
                onClick={() => navigate('/lista-espera')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <ListaEsperaCard 
              usuarios={solicitudesEspera}
              loading={loadingEspera}
              onVerificar={handleVerificarSolicitud}
            />
          </div>

          {/* CURSOS DISPONIBLES */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <h2>Cursos Disponibles</h2>
              </div>
            </div>
            <MisCursosCard 
              cursos={dashboardData.cursos} 
              loading={loading}
              rol={rol}
            />
          </div>
        </>
      );
    }

    return null;
  };

  const renderContenidoDerecha = () => {
    if (esEstudiante) {
      return (
        <>
          {/* DEUDAS */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <h2>Deudas Pendientes</h2>
            </div>
            <DeudasCard 
              deudas={dashboardData.deudas} 
              loading={loading}
              onPagar={handlePagarDeuda}
              rol={rol}
            />
          </div>

          {/* GRÁFICO DE DESEMPEÑO */}
          <GraficoDesempeno 
            data={{
              clasesTomadas: 8,
              clasesTotales: 12,
              clasesCompletadas: 6,
              progreso: 67
            }}
            loading={loading}
          />
        </>
      );
    }

    if (esProfesor) {
      const alumnosFormateados = formatearAlumnos();
      
      return (
        <>
          {/* MIS ALUMNOS */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <h2>Mis Alumnos</h2>
            </div>
            <MisAlumnosCard 
              alumnos={alumnosFormateados.length > 0 ? alumnosFormateados : [
                { id: 1, nombre: 'No hay alumnos asignados', rut: '---', estado: 'inactivo' }
              ]}
              loading={loadingProfesor}
            />
          </div>

          {/* RESUMEN DE ALUMNOS */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Resumen de Alumnos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Alumnos Activos</span>
                <span className="font-bold text-green-700">
                  {alumnosFormateados.filter(a => a.estado === 'activo').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-bold text-yellow-700">
                  {alumnosFormateados.filter(a => a.estado === 'pendiente').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-600">Clases Hoy</span>
                <span className="font-bold text-blue-700">
                  {clasesProfesorData.filter(c => {
                    const hoy = new Date().toISOString().split('T')[0];
                    return c.fecha_clase === hoy;
                  }).length || 0}
                </span>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (esSecretaria) {
      return (
        <>
          {/* ALUMNOS CON DEUDAS */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <h2>Alumnos con Deudas</h2>
            </div>
            <AlumnosConDeudasCard 
              alumnos={alumnosConDeudas}
              loading={loading}
            />
          </div>

          {/* ESTADÍSTICAS DE SOLICITUDES */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="text-sm text-gray-600">En Espera</span>
                <span className="font-bold text-yellow-700">{solicitudesEspera.length}</span>
              </div>
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Verificados Hoy</span>
                <span className="font-bold text-green-700">3</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-600">Total Registrados</span>
                <span className="font-bold text-blue-700">45</span>
              </div>
              <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                <span className="text-sm text-gray-600">Con Deudas</span>
                <span className="font-bold text-red-700">{alumnosConDeudas.length}</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-custom p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient">
                {getGreeting()}
              </h1>
              <p className="text-gray-600">
                <span className="font-semibold text-blue-600">{user?.nombre || 'Usuario'}</span>
                <span className="inline-block bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full capitalize ml-2">
                  {user?.rol || 'Estudiante'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="font-mono text-lg font-bold text-gray-700">
                    {currentTime.toLocaleTimeString('es-CL')}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatearFecha(currentTime)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mb-6">
          <EstadisticasCard 
            estadisticas={{
              totalCursos: esEstudiante ? dashboardData.estadisticas?.totalCursos : 
                           esProfesor ? clasesProfesorData.length : 
                           esSecretaria ? solicitudesEspera.length : 5,
              clasesCompletadas: esEstudiante ? dashboardData.estadisticas?.clasesCompletadas :
                               esProfesor ? 12 : 
                               esSecretaria ? 3 : 0,
              deudasPendientes: esEstudiante ? dashboardData.estadisticas?.deudasPendientes :
                              esProfesor ? alumnosAsignadosData.length :
                              esSecretaria ? alumnosConDeudas.length : 0,
              proximaClase: esEstudiante ? dashboardData.estadisticas?.proximaClase :
                          esProfesor ? '10:00 AM' :
                          esSecretaria ? `${solicitudesEspera.length} pendientes` : 'Sin datos'
            }} 
            loading={loading}
            rol={rol}
          />
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">
            {renderContenidoIzquierda()}
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-6">
            {renderContenidoDerecha()}

            {/* ACCESO RÁPIDO */}
            <AccesoRapidoCard rol={rol} />
          </div>
        </div>
      </div>
    </div>
  );
}