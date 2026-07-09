import { Users, Clock, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';

export const ListaEsperaCard = ({ usuarios, loading, onVerificar }) => {
  
  const verBoleta = (usuario) => {
    if (!usuario || !usuario.boletas || usuario.boletas.length === 0) {
      alert('Este usuario no tiene una boleta asociada');
      return;
    }
    
    const boleta = usuario.boletas[0];
    if (!boleta.url_comprobante) {
      alert('No hay archivo de boleta disponible');
      return;
    }
    
    const url = `http://localhost:3000/${boleta.url_comprobante}`;
    window.open(url, '_blank');
  };

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

  const usuariosMostrar = usuarios.slice(0, 3);

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
        {usuariosMostrar.map((usuario) => (
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
                  {/*  estado de la boleta */}
                  {usuario.boletas && usuario.boletas.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      usuario.boletas[0].estado === 'verificada' ? 'bg-green-100 text-green-700' :
                      usuario.boletas[0].estado === 'rechazada' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      Boleta: {usuario.boletas[0].estado || 'pendiente'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/*  Botón ver boleta PDF */}
                {usuario.boletas && usuario.boletas.length > 0 && (
                  <button
                    onClick={() => verBoleta(usuario)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    title="Ver boleta de pago"
                  >
                    <FileText className="w-3 h-3" />
                    Boleta
                  </button>
                )}
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
      {usuarios.length > 3 && (
        <div className="mt-4 pt-3 border-t border-yellow-200 text-center">
          <a href="/lista-espera" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas las solicitudes ({usuarios.length - 3} más)
          </a>
        </div>
      )}
    </div>
  );
};