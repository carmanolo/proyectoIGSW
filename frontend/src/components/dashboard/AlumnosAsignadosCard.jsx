import { Users, UserCheck, Calendar, Clock } from 'lucide-react';

export const AlumnosAsignadosCard = ({ alumnos, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!alumnos || alumnos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
        <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No tienes alumnos asignados</p>
        <p className="text-sm text-gray-500">Aún no hay alumnos en tus cursos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Mis Alumnos</h3>
        </div>
        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {alumnos.length} alumnos
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{alumno.nombre}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-600">RUT: {alumno.rut}</span>
                  <span className="text-xs text-gray-600">📱 {alumno.telefono}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {alumno.clases_tomadas || 0} clases
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Próxima: {alumno.proxima_clase || 'Sin clase'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  alumno.estado === 'activo' ? 'bg-green-100 text-green-700' :
                  alumno.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {alumno.estado || 'Activo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};