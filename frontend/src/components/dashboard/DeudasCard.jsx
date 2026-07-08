import { DollarSign, AlertCircle, CheckCircle, Clock, Users, UserCheck } from 'lucide-react';

export const DeudasCard = ({ deudas, loading, onPagar, rol, alumnosEspera }) => {
  const rolLower = rol?.toLowerCase() || 'estudiante';

  if (loading) {
    return (
      <div className="rounded-xl p-6 bg-gray-200 animate-pulse">
        <div className="h-16 bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-16 bg-gray-300 rounded-lg mb-2"></div>
        <div className="h-16 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  // Para Secretaría - Mostrar Alumnos en Espera
  if (rolLower === 'secretaria' || rolLower === 'secretario') {
    if (!alumnosEspera || alumnosEspera.length === 0) {
      return (
        <div className="rounded-xl p-6 border border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">¡Sin Solicitudes!</h3>
          </div>
          <p className="text-gray-600 text-sm">No hay alumnos en espera de verificación</p>
        </div>
      );
    }

    return (
      <div className="rounded-xl p-6 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Alumnos en Espera</h3>
          </div>
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {alumnosEspera.length}
          </span>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {alumnosEspera.map((alumno) => (
            <div key={alumno.id} className="bg-white/70 rounded-lg p-3 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{alumno.nombre}</p>
                  <p className="text-xs text-gray-500">
                    RUT: {alumno.rut} • {alumno.sede}
                  </p>
                  <p className="text-xs text-gray-500">
                    Plan: {alumno.plan_contratado?.nombre || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    {new Date(alumno.fecha_registro_espera).toLocaleDateString('es-CL')}
                  </span>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                    onClick={() => onPagar(alumno)}
                  >
                    Verificar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-yellow-200 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {alumnosEspera.length} solicitud{alumnosEspera.length > 1 ? 'es' : ''} pendiente{alumnosEspera.length > 1 ? 's' : ''}
          </span>
          <button
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            onClick={() => onPagar(null)}
          >
            Ver todas →
          </button>
        </div>
      </div>
    );
  }

  // Para Estudiante - Mostrar Deudas
  const deudasPendientes = deudas?.filter(d => d.estado_pago === 'pendiente') || [];
  const totalDeuda = deudasPendientes.reduce((sum, d) => sum + parseFloat(d.monto_total || 0), 0);
  const tieneDeuda = deudasPendientes.length > 0;

  if (!tieneDeuda) {
    return (
      <div className="rounded-xl p-6 border border-green-200 bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800">¡Sin Deudas!</h3>
        </div>
        <p className="text-gray-600 text-sm">Estás al día con tus pagos.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-6 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-800">Deudas Pendientes</h3>
        </div>
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          ${totalDeuda.toLocaleString()}
        </span>
      </div>
      
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {deudasPendientes.map((deuda) => (
          <div key={deuda.id_inscripcion} className="bg-white/70 rounded-lg p-3 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">{deuda.plan?.nombre || 'Plan'}</p>
                <p className="text-xs text-gray-500">
                  Vence: {new Date(deuda.fecha_vencimiento_pago).toLocaleDateString('es-CL')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-yellow-700">
                  ${parseFloat(deuda.monto_total || 0).toLocaleString()}
                </span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                  onClick={() => onPagar(deuda)}
                >
                  Pagar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-yellow-200 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {deudasPendientes.length} deuda{deudasPendientes.length > 1 ? 's' : ''} pendiente{deudasPendientes.length > 1 ? 's' : ''}
        </span>
        <button
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          onClick={() => onPagar(null)}
        >
          Ver todas →
        </button>
      </div>
    </div>
  );
};