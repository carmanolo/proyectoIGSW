import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useVentas } from '../hooks/useVentas';

export default function GestionarVentas() {
  const { user } = useAuth();
  const { getAllVentas, aprobarVenta, rechazarVenta, eliminarVenta, loading, error } = useVentas();
  
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [filterEstado, setFilterEstado] = useState('pendiente');

  useEffect(() => {
    if (user?.rol === 'secretario') {
      cargarVentas();
    }
  }, [user]);

  const cargarVentas = async () => {
    try {
      const data = await getAllVentas();
      setVentas(data || []);
    } catch (err) {
      console.error("Error al cargar todas las ventas", err);
    }
  };

  const handleAprobar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas aprobar esta venta? Se sumarán las clases al usuario.")) return;
    
    setMensaje(null);
    try {
      await aprobarVenta(id);
      setMensaje({ type: 'success', text: 'Venta aprobada correctamente.' });
      cargarVentas();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al aprobar la venta.' });
    }
  };

  const handleRechazar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas rechazar esta venta?")) return;
    
    setMensaje(null);
    try {
      await rechazarVenta(id);
      setMensaje({ type: 'success', text: 'Venta rechazada correctamente.' });
      cargarVentas();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al rechazar la venta.' });
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer y restará las clases si ya fue aprobada.")) return;
    
    setMensaje(null);
    try {
      await eliminarVenta(id);
      setMensaje({ type: 'success', text: 'Venta eliminada correctamente.' });
      cargarVentas();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al eliminar la venta.' });
    }
  };

  if (user?.rol !== 'secretario') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página. Acceso restringido a secretarios.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Ventas de Clases Extras</h1>

      {mensaje && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${mensaje.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-700">Filtrar Solicitudes</h2>
        <select 
          className="select select-bordered w-full sm:max-w-xs"
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="todas">Todas las Solicitudes</option>
          <option value="pendiente">Solo Pendientes</option>
          <option value="aprobada">Solo Aprobadas</option>
          <option value="rechazada">Solo Rechazadas</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Listado de Ventas</h2>
        
        {(() => {
          const ventasFiltradas = ventas.filter(venta => {
            if (filterEstado === 'todas') return true;
            return venta.estado === filterEstado;
          });

          if (loading && ventas.length === 0) return <p className="text-gray-500 text-center py-4">Cargando...</p>;
          if (ventasFiltradas.length === 0) return <p className="text-gray-500 text-center py-4">No hay solicitudes para el filtro seleccionado.</p>;

          return (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Alumno</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Cant. / Restantes</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Monto Total</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Comprobante</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{venta.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {venta.user ? (
                        <div>
                          <p className="font-medium">{venta.user.nombre} {venta.user.apellidos}</p>
                          <p className="text-xs text-gray-500">{venta.user.email}</p>
                        </div>
                      ) : (
                        'Usuario Desconocido'
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(venta.fecha_venta).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="font-semibold">{venta.cantidad}</span>
                      {venta.estado === 'aprobada' && (
                        <span className="text-xs text-gray-500 block">Quedan: {venta.clases_restantes}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {venta.monto_total ? venta.monto_total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : '$0'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <a 
                        href={`http://localhost:3000${venta.comprobante_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        Ver
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venta.estado === 'aprobada' ? 'bg-green-100 text-green-800' : 
                        venta.estado === 'vencida' ? 'bg-gray-200 text-gray-600' :
                        venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {venta.estado ? venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1) : 'Desconocido'}
                      </span>
                      {venta.estado === 'aprobada' && venta.fecha_vencimiento && (
                        <span className="text-xs text-red-500 block mt-1 font-medium">
                          Vence: {new Date(venta.fecha_vencimiento).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      {venta.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleAprobar(venta.id)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(venta.id)}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEliminar(venta.id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium transition disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          );
        })()}
      </div>
    </div>
  );
}
