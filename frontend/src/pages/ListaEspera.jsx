import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getListaEsperaService, verificarRegistroService } from '@services/registro.service.js';
import Swal from 'sweetalert2';
import { Eye, CheckCircle, XCircle, Clock, User, Calendar, FileText, ExternalLink } from 'lucide-react';

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

        const data = response.data || [];
        console.log(' Primera solicitud:', data[0]);
        console.log(' Boleta de la primera solicitud:', data[0]?.boletas);
        setSolicitudes(data);
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

  const verBoleta = (solicitud) => {
    if (!solicitud) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró la solicitud',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!solicitud.boletas || solicitud.boletas.length === 0) {
      Swal.fire({
        title: 'Sin boleta',
        text: 'Este usuario no tiene una boleta asociada',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const boleta = solicitud.boletas[0];
    console.log('📄 Boleta:', boleta);

    if (!boleta.url_comprobante) {
      Swal.fire({
        title: 'Sin archivo',
        text: 'No hay archivo de boleta disponible',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    const url = `http://localhost:3000/${boleta.url_comprobante}`;
    console.log('🔗 Abriendo PDF:', url);
    window.open(url, '_blank');
  };

  const verDetalleBoleta = (solicitud) => {
    if (!solicitud || !solicitud.boletas || solicitud.boletas.length === 0) {
      Swal.fire({
        title: 'Sin boleta',
        text: 'Este usuario no tiene una boleta asociada',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const boleta = solicitud.boletas[0];
    
    Swal.fire({
      title: ' Detalle de Boleta',
      width: 600,
      html: `
        <div class="text-left space-y-3">
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold">Nº Boleta:</p>
            <p class="text-gray-700">${boleta.numero_boleta || 'N/A'}</p>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <p class="font-semibold">Monto:</p>
            <p class="text-gray-700">$${boleta.monto || 0}</p>
          </div>
          <div class="bg-yellow-50 p-3 rounded-lg">
            <p class="font-semibold">Método de Pago:</p>
            <p class="text-gray-700">${boleta.metodo_pago || 'N/A'}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="font-semibold">Fecha de Pago:</p>
            <p class="text-gray-700">${boleta.fecha_pago ? new Date(boleta.fecha_pago).toLocaleDateString('es-CL') : 'N/A'}</p>
          </div>
          ${boleta.banco_origen ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="font-semibold">Banco Origen:</p>
              <p class="text-gray-700">${boleta.banco_origen}</p>
            </div>
          ` : ''}
          ${boleta.banco_destino ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="font-semibold">Banco Destino:</p>
              <p class="text-gray-700">${boleta.banco_destino}</p>
            </div>
          ` : ''}
          ${boleta.rut_titular ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="font-semibold">RUT Titular:</p>
              <p class="text-gray-700">${boleta.rut_titular}</p>
            </div>
          ` : ''}
          ${boleta.nombre_titular ? `
            <div class="bg-gray-50 p-3 rounded-lg">
              <p class="font-semibold">Nombre Titular:</p>
              <p class="text-gray-700">${boleta.nombre_titular}</p>
            </div>
          ` : ''}
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold">Estado:</p>
            <span class="badge ${boleta.estado === 'verificada' ? 'badge-success' : boleta.estado === 'rechazada' ? 'badge-error' : 'badge-warning'}">
              ${boleta.estado || 'pendiente'}
            </span>
          </div>
          <div class="mt-3">
            <button onclick="window.open('http://localhost:3000/${boleta.url_comprobante}', '_blank')" 
                    class="btn btn-primary w-full">
              Ver PDF de la Boleta
            </button>
          </div>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      theme: 'light'
    });
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
          <h2 className="text-2xl font-bold mb-2">⚠️ Acceso Denegado</h2>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boleta</th>
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
                      <td className="px-4 py-3">
                        {/*  Mostrar boleta */}
                        {solicitud.boletas && solicitud.boletas.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => verBoleta(solicitud)}
                              className="btn btn-xs btn-info text-white flex items-center gap-1"
                              title="Ver boleta PDF"
                            >
                              <FileText className="w-3 h-3" />
                              Ver PDF
                            </button>
                            <span className={`badge text-xs ${
                              solicitud.boletas[0].estado === 'verificada' ? 'badge-success' :
                              solicitud.boletas[0].estado === 'rechazada' ? 'badge-error' :
                              'badge-warning'
                            }`}>
                              {solicitud.boletas[0].estado || 'pendiente'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Sin boleta</span>
                        )}
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
                          {solicitud.boletas && solicitud.boletas.length > 0 && (
                            <button
                              onClick={() => verDetalleBoleta(solicitud)}
                              className="btn btn-sm btn-info text-white"
                              title="Ver detalles boleta"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
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

              {/* ✅ Mostrar  boleta en el modal */}
              {selectedSolicitud.boletas && selectedSolicitud.boletas.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">📄 Boleta</h4>
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
                      <span className={`badge ml-2 ${selectedSolicitud.boletas[0].estado === 'verificada' ? 'badge-success' : selectedSolicitud.boletas[0].estado === 'rechazada' ? 'badge-error' : 'badge-warning'}`}>
                        {selectedSolicitud.boletas[0].estado}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => verBoleta(selectedSolicitud)}
                      className="btn btn-sm btn-primary text-white flex-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver PDF
                    </button>
                    <button
                      onClick={() => verDetalleBoleta(selectedSolicitud)}
                      className="btn btn-sm btn-info text-white"
                    >
                      <Eye className="w-3 h-3" />
                      Detalles
                    </button>
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