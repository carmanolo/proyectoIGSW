import { TrendingUp, Users, Calendar, DollarSign, UserCheck, Clock, FileText, Award, GraduationCap } from 'lucide-react';

export const EstadisticasCard = ({ estadisticas, loading, rol }) => {
  const statsData = estadisticas || {
    totalCursos: 0,
    clasesCompletadas: 0,
    deudasPendientes: 0,
    proximaClase: 'Sin clases'
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl p-4 bg-gray-200 animate-pulse">
            <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const rolLower = rol?.toLowerCase() || 'estudiante';

  const getStats = () => {
    switch(rolLower) {
      case 'estudiante':
        return [
          {
            titulo: 'Cursos Activos',
            valor: statsData.totalCursos || 0,
            icono: <GraduationCap className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-200'
          },
          {
            titulo: 'Clases Completadas',
            valor: statsData.clasesCompletadas || 0,
            icono: <Award className="w-5 h-5 text-green-500" />,
            bg: 'bg-green-50',
            border: 'border-green-200'
          },
          {
            titulo: 'Deudas Pendientes',
            valor: statsData.deudasPendientes || 0,
            icono: <DollarSign className="w-5 h-5 text-yellow-500" />,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
          },
          {
            titulo: 'Próxima Clase',
            valor: statsData.proximaClase || 'Sin clases',
            icono: <Calendar className="w-5 h-5 text-purple-500" />,
            bg: 'bg-purple-50',
            border: 'border-purple-200'
          }
        ];

      case 'profesor':
        return [
          {
            titulo: 'Cursos a Cargo',
            valor: statsData.totalCursos || 0,
            icono: <Users className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-200'
          },
          {
            titulo: 'Clases Impartidas',
            valor: statsData.clasesCompletadas || 0,
            icono: <TrendingUp className="w-5 h-5 text-green-500" />,
            bg: 'bg-green-50',
            border: 'border-green-200'
          },
          {
            titulo: 'Alumnos Asignados',
            valor: statsData.deudasPendientes || 0,
            icono: <UserCheck className="w-5 h-5 text-yellow-500" />,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
          },
          {
            titulo: 'Próxima Clase',
            valor: statsData.proximaClase || 'Sin clases',
            icono: <Clock className="w-5 h-5 text-purple-500" />,
            bg: 'bg-purple-50',
            border: 'border-purple-200'
          }
        ];

      case 'secretaria':
      case 'secretario':
        return [
          {
            titulo: 'Solicitudes en Espera',
            valor: statsData.totalCursos || 0,
            icono: <Users className="w-5 h-5 text-yellow-500" />,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
          },
          {
            titulo: 'Verificados Hoy',
            valor: statsData.clasesCompletadas || 0,
            icono: <Award className="w-5 h-5 text-green-500" />,
            bg: 'bg-green-50',
            border: 'border-green-200'
          },
          {
            titulo: 'Alumnos con Deudas',
            valor: statsData.deudasPendientes || 0,
            icono: <DollarSign className="w-5 h-5 text-red-500" />,
            bg: 'bg-red-50',
            border: 'border-red-200'
          },
          {
            titulo: 'Pendientes de Pago',
            valor: statsData.proximaClase || '0',
            icono: <FileText className="w-5 h-5 text-purple-500" />,
            bg: 'bg-purple-50',
            border: 'border-purple-200'
          }
        ];

      case 'administrador':
        return [
          {
            titulo: 'Usuarios Totales',
            valor: statsData.totalCursos || 0,
            icono: <Users className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-200'
          },
          {
            titulo: 'Cursos Activos',
            valor: statsData.clasesCompletadas || 0,
            icono: <GraduationCap className="w-5 h-5 text-green-500" />,
            bg: 'bg-green-50',
            border: 'border-green-200'
          },
          {
            titulo: 'Ingresos Totales',
            valor: `$${statsData.deudasPendientes || 0}`,
            icono: <DollarSign className="w-5 h-5 text-yellow-500" />,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200'
          },
          {
            titulo: 'Solicitudes',
            valor: statsData.proximaClase || '0',
            icono: <FileText className="w-5 h-5 text-purple-500" />,
            bg: 'bg-purple-50',
            border: 'border-purple-200'
          }
        ];

      default:
        return [
          {
            titulo: 'Total',
            valor: statsData.totalCursos || 0,
            icono: <Users className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50',
            border: 'border-blue-200'
          }
        ];
    }
  };

  const stats = getStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bg} rounded-xl p-4 border ${stat.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">{stat.titulo}</p>
              <p className="text-xl font-bold text-gray-800 mt-1">{stat.valor}</p>
            </div>
            <div className="bg-white rounded-full p-2 shadow-sm">
              {stat.icono}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};