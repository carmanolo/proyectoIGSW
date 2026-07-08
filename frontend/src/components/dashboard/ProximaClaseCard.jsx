import { Clock, Calendar, MapPin, User } from 'lucide-react';

export const ProximaClaseCard = ({ clase, loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl p-6 bg-gray-200 animate-pulse">
        <div className="h-6 bg-gray-300 rounded-lg w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-300 rounded-lg w-full mb-2"></div>
        <div className="h-6 bg-gray-300 rounded-lg w-2/3"></div>
      </div>
    );
  }

  if (!clase) {
    return (
      <div className="rounded-xl p-6 bg-gray-50 border border-gray-200 text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-gray-600">No hay clases programadas para hoy</p>
        <p className="text-sm text-gray-500 mt-1">¡Disfruta tu día libre!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              PRÓXIMA CLASE
            </span>
            <span className="text-xs text-blue-600 font-medium">
              {clase.fecha}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {clase.nombre || 'Clase de Conducción'}
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{clase.hora_inicio} - {clase.hora_fin}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{clase.ubicacion || 'Sala Principal'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Instructor: {clase.instructor || 'Por asignar'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500 text-white rounded-lg p-3 text-center min-w-[60px]">
          <div className="text-2xl font-bold">
            {clase.hora_inicio?.split(':')[0] || '--'}
          </div>
          <div className="text-xs">HORA</div>
        </div>
      </div>
      
      {clase.estado && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            clase.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
            clase.estado === 'en_curso' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {clase.estado === 'pendiente' ? ' Pendiente' :
             clase.estado === 'en_curso' ? ' En curso' :
             ' Finalizada'}
          </span>
        </div>
      )}
    </div>
  );
};