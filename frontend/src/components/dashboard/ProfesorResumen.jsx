import { Calendar, Users, UserCheck, Clock } from 'lucide-react';

export const ProfesorResumen = ({ clases, loading }) => {
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

  if (!clases || clases.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">No hay clases programadas para hoy</p>
        <p className="text-sm text-gray-500">Disfruta tu día libre</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Siguiente Clase</h3>
        </div>
        <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
          {clases.length} clase{clases.length > 1 ? 's' : ''} hoy
        </span>
      </div>
      
      <div className="space-y-3">
        {clases.map((clase, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <p className="font-medium text-gray-800">{clase.nombre || 'Clase de Conducción'}</p>
              <p className="text-xs text-gray-500">
                {clase.hora_inicio} - {clase.hora_fin} • {clase.ubicacion || 'Sala Principal'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {clase.estado || 'Pendiente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};