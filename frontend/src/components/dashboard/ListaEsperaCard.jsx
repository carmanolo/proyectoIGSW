import { Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export const ListaEsperaCard = ({ usuarios, loading, onVerificar }) => {
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

  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 font-medium">No hay alumnos en espera</p>
        <p className="text-sm text-green-600">Todos los registros han sido verificados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Alumnos en Espera</h3>
        </div>
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {usuarios.length} pendientes
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{usuario.nombre}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-600">RUT: {usuario.rut}</span>
                  <span className="text-xs text-gray-600">📱 {usuario.telefono}</span>
                  <span className="text-xs text-gray-600">🏫 {usuario.sede}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Plan: {usuario.plan_contratado?.nombre || 'N/A'}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(usuario.fecha_registro_espera).toLocaleDateString('es-CL')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onVerificar(usuario.id, 'verificado')}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Verificar
                </button>
                <button
                  onClick={() => onVerificar(usuario.id, 'rechazado')}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-3 h-3" />
                  Rechazar
                </button>
                <button
                  onClick={() => onVerificar(usuario.id, 'ver')}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1.5 rounded-lg transition-colors"
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};