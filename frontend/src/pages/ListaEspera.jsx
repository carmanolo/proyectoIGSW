import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getListaEsperaService, verificarRegistroService } from '@services/registro.service.js';
import Swal from 'sweetalert2';
import { Eye, CheckCircle, XCircle, Clock, User, Calendar, FileText } from 'lucide-react';

export const ListaEspera = () => {
  const { user } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await getListaEsperaService();
      console.log(' Lista de espera:', response);
      if (response && response.status === 'Success') {
        setSolicitudes(response.data || []);
      } else {
        setSolicitudes([]);
      }
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async (id, estado) => {
    const actionText = estado === 'verificado' ? 'aprobar' : 'rechazar';
    
    const result = await Swal.fire({
      title: `¿${estado === 'verificado' ? 'Aprobar' : 'Rechazar'} solicitud?`,
      text: `¿Estás seguro de ${actionText} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: estado === 'verificado' ? '#10B981' : '#EF4444',
    });

    if (!result.isConfirmed) return;

    try {
      const { value: observaciones } = await Swal.fire({
        title: 'Observaciones (opcional)',
        input: 'textarea',
        inputPlaceholder: 'Escribe alguna observación...',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Saltar',
        inputValidator: (value) => {
          if (value && value.length > 500) {
            return 'Las observaciones no pueden tener más de 500 caracteres';
          }
        }
      });

      const response = await verificarRegistroService(id, {
        estado,
        observaciones: observaciones || null
      });

      if (response && response.status === 'Success') {
        await Swal.fire({
          title: '¡Éxito!',
          text: response.message || 'Solicitud procesada correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        cargarSolicitudes();
      } else {
        throw new Error(response?.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error al verificar:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar la solicitud',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const verDetalle = (solicitud) => {
    setSelectedSolicitud(solicitud);
    const modal = document.getElementById('modal-detalle-solicitud');
    if (modal) modal.showModal();
  };

  if (user?.rol !== 'secretario' && user?.rol !== 'secretaria' && user?.rol !== 'ADMINISTRADOR') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 text-red-700 p-6 rounded-xl border border-red-200 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2"> Acceso Denegado</h2>
          <p>No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-custom p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient">📋 Lista de Espera</h1>
              <p className="text-gray-600 mt-1">
                Gestiona las solicitudes de registro de nuevos alumnos
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {solicitudes.length} pendientes
              </span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay solicitudes pendientes</h2>
            <p className="text-gray-600">Todas las solicitudes han sido procesadas</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RUT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sede</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudes.map((solicitud, index) => (
                    <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">{solicitud.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{solicitud.rut}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{solicitud.sede}</td>
                      <td className="px-4 py-3">
                        <span className="badge badge-primary text-xs">
                          {solicitud.plan_contratado?.nombre || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(solicitud.fecha_registro_espera).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => verDetalle(solicitud)}
                            className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-50"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVerificar(solicitud.id, 'verificado')}
                            className="btn btn-sm btn-success text-white"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleVerificar(solicitud.id, 'rechazado')}
                            className="btn btn-sm btn-error text-white"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detalle */}
      <dialog id="modal-detalle-solicitud" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-xl mb-4 text-gradient">📄 Detalle de Solicitud</h3>
          {selectedSolicitud && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-800">{selectedSolicitud.nombre}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">RUT</p>
                  <p className="font-medium text-gray-800">{selectedSolicitud.rut}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-800">{selectedSolicitud.telefono}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Sede</p>
                  <p className="font-medium text-gray-800">{selectedSolicitud.sede}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Plan</p>
                  <p className="font-medium text-gray-800">{selectedSolicitud.plan_contratado?.nombre || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Fecha de solicitud</p>
                  <p className="font-medium text-gray-800">
                    {new Date(selectedSolicitud.fecha_registro_espera).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>

              {selectedSolicitud.boletas && selectedSolicitud.boletas.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2"> Boleta</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">N° Boleta:</span>
                      <span className="font-medium ml-2">{selectedSolicitud.boletas[0].numero_boleta}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Monto:</span>
                      <span className="font-medium ml-2">${selectedSolicitud.boletas[0].monto}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Método:</span>
                      <span className="font-medium ml-2">{selectedSolicitud.boletas[0].metodo_pago}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <span className={`badge ml-2 ${selectedSolicitud.boletas[0].estado === 'pendiente' ? 'badge-warning' : 'badge-success'}`}>
                        {selectedSolicitud.boletas[0].estado}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Cerrar</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ListaEspera;