import { DollarSign, Users } from 'lucide-react';

export const AlumnosConDeudasCard = ({ alumnos, loading }) => {
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
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 font-medium">No hay alumnos con deudas</p>
        <p className="text-sm text-green-600">Todos los pagos están al día</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Alumnos con Deudas</h3>
        </div>
        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {alumnos.length}
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{alumno.nombre}</p>
                <p className="text-xs text-gray-500">RUT: {alumno.rut}</p>
                <p className="text-xs text-gray-500">Deuda: ${alumno.deuda?.toLocaleString() || '0'}</p>
              </div>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {alumno.estado_pago || 'Pendiente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};