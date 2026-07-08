import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
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
import { 
  Clock, Calendar, ChevronRight, Sparkles, 
  GraduationCap, DollarSign, Users, UserCheck 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { dashboardData, loading, fetchDashboard } = useDashboard();
  const { proximaClase, loading: loadingClase } = useProximaClase();
  const { handleContratarPlan } = useContratarPlan(user?.id, fetchDashboard);
  const { handlePagarDeuda } = usePagarDeuda(fetchDashboard);

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

  // Datos de ejemplo (después conectar con backend)
  const clasesProfesor = [
    { nombre: 'Clase Práctica Avanzada', hora_inicio: '10:00', hora_fin: '11:30', ubicacion: 'Sala 101', estado: 'Pendiente' },
    { nombre: 'Clase Teórica', hora_inicio: '14:00', hora_fin: '15:30', ubicacion: 'Sala 203', estado: 'Pendiente' },
  ];

  const alumnosAsignados = [
    { id: 1, nombre: 'Carlos López', rut: '11.111.111-1', estado: 'activo' },
    { id: 2, nombre: 'Ana Martínez', rut: '22.222.222-2', estado: 'pendiente' },
    { id: 3, nombre: 'Pedro Sánchez', rut: '33.333.333-3', estado: 'activo' },
  ];

  const alumnosConDeudas = [
    { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', deuda: 45000, estado_pago: 'Pendiente' },
    { id: 2, nombre: 'María González', rut: '98.765.432-1', deuda: 32000, estado_pago: 'Pendiente' },
  ];

  const alumnosEspera = [
    { id: 1, nombre: 'Juan Pérez', rut: '12.345.678-9', telefono: '+56912345678', sede: 'Concepción', plan_contratado: { nombre: 'Básico' }, fecha_registro_espera: '2024-01-15' },
    { id: 2, nombre: 'María González', rut: '98.765.432-1', telefono: '+56987654321', sede: 'Chillán', plan_contratado: { nombre: 'Avanzado' }, fecha_registro_espera: '2024-01-14' },
  ];

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
      return (
        <>
          {/* SIGUIENTE CLASE */}
          <ProfesorResumen 
            clases={clasesProfesor}
            loading={loading}
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
              cursos={dashboardData.cursos} 
              loading={loading}
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
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Ver todas <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <ListaEsperaCard 
              usuarios={alumnosEspera}
              loading={loading}
              onVerificar={(id, estado) => {
                console.log(`Verificar usuario ${id} como ${estado}`);
              }}
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
      return (
        <>
          {/* MIS ALUMNOS */}
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <h2>Mis Alumnos</h2>
            </div>
            <MisAlumnosCard 
              alumnos={alumnosAsignados}
              loading={loading}
            />
          </div>

          {/* RESUMEN DE ALUMNOS */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Resumen de Alumnos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Alumnos Activos</span>
                <span className="font-bold text-green-700">{alumnosAsignados.filter(a => a.estado === 'activo').length}</span>
              </div>
              <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="text-sm text-gray-600">Pendientes</span>
                <span className="font-bold text-yellow-700">{alumnosAsignados.filter(a => a.estado === 'pendiente').length}</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm text-gray-600">Clases Hoy</span>
                <span className="font-bold text-blue-700">{clasesProfesor.length}</span>
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
                <span className="font-bold text-yellow-700">{alumnosEspera.length}</span>
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
              <div className="relative">
              </div>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mb-6">
          <EstadisticasCard 
            estadisticas={{
              totalCursos: esEstudiante ? dashboardData.estadisticas?.totalCursos : 
                           esProfesor ? 3 : 
                           esSecretaria ? alumnosEspera.length : 5,
              clasesCompletadas: esEstudiante ? dashboardData.estadisticas?.clasesCompletadas :
                               esProfesor ? 12 : 
                               esSecretaria ? 3 : 0,
              deudasPendientes: esEstudiante ? dashboardData.estadisticas?.deudasPendientes :
                              esProfesor ? alumnosAsignados.length :
                              esSecretaria ? alumnosConDeudas.length : 0,
              proximaClase: esEstudiante ? dashboardData.estadisticas?.proximaClase :
                          esProfesor ? '10:00 AM' :
                          esSecretaria ? `${alumnosEspera.length} pendientes` : 'Sin datos'
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