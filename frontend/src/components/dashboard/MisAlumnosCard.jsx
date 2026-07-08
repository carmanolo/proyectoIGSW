import { UserCheck, Users } from 'lucide-react';

export const MisAlumnosCard = ({ alumnos, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-xl p-6 border border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!alumnos || alumnos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
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
          {alumnos.length}
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{alumno.nombre}</p>
                <p className="text-xs text-gray-500">RUT: {alumno.rut}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                alumno.estado === 'activo' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {alumno.estado || 'Activo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};