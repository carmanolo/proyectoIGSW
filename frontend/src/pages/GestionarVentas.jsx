import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useVentas } from '../hooks/useVentas';
import { listarPagosService, aprobarPagoService, rechazarPagoService } from '@services/pago.service';
import Swal from 'sweetalert2';

export default function GestionarVentas() {
  const { user } = useAuth();
  const { getAllVentas, aprobarVenta, rechazarVenta, eliminarVenta, loading } = useVentas();
  
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  
  const [filterEstadoHistorial, setFilterEstadoHistorial] = useState('todas');
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    let intervalId;
    if (user?.rol === 'secretario') {
      cargarTodo();
      // Poll every 5 seconds to simulate real-time updates
      intervalId = setInterval(() => {
        cargarTodoSilencioso();
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const cargarTodoSilencioso = async () => {
    try {
      const [ventasData, pagosData] = await Promise.all([
        getAllVentas(),
        listarPagosService()
      ]);
      
      const unificadas = [];
      if (ventasData) {
        ventasData.forEach(v => {
          unificadas.push({
            id_ref: `v-${v.id}`,
            tipo: 'venta',
            id: v.id,
            user: v.user,
            fecha: v.fecha_venta,
            monto: v.monto_total,
            comprobante: v.comprobante,
            estado: v.estado,
            concepto: `Pack de ${v.cantidad} Clases Extra`,
            extra_info: v.estado === 'aprobada' ? `Restantes: ${v.clases_restantes}` : null
          });
        });
      }
      if (pagosData && pagosData.data) {
        pagosData.data.forEach(p => {
          unificadas.push({
            id_ref: `p-${p.id}`,
            tipo: 'pago',
            id: p.id,
            user: p.user,
            fecha: p.fecha_solicitud,
            monto: p.monto,
            comprobante: p.comprobante,
            estado: p.estado,
            concepto: `Cuota de Deuda (${p.tipo_deuda})`,
            extra_info: p.deuda_id ? `Ref: ${p.deuda_id}` : null
          });
        });
      }
      
      unificadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setSolicitudes(unificadas);
    } catch (error) {
      console.error("Error silently fetching data:", error);
    }
  };

  const cargarTodo = async () => {
    setLoadingDatos(true);
    try {
      const [ventasData, pagosData] = await Promise.all([
        getAllVentas(),
        listarPagosService()
      ]);
      
      const unificadas = [];
      if (ventasData) {
        ventasData.forEach(v => {
          unificadas.push({
            id_ref: `v-${v.id}`,
            tipo: 'venta',
            id: v.id,
            user: v.user,
            fecha: v.fecha_venta,
            monto: v.monto_total,
            comprobante: v.comprobante,
            estado: v.estado,
            concepto: `Pack de ${v.cantidad} Clases Extra`,
            extra_info: v.estado === 'aprobada' ? `Restantes: ${v.clases_restantes}` : null
          });
        });
      }
      if (pagosData && pagosData.data) {
        pagosData.data.forEach(p => {
          unificadas.push({
            id_ref: `p-${p.id}`,
            tipo: 'pago',
            id: p.id,
            user: p.user,
            fecha: p.fecha_solicitud,
            monto: p.monto,
            comprobante: p.comprobante,
            estado: p.estado,
            concepto: `Pago de deuda (${p.tipo_deuda.toUpperCase()} #${p.deuda_id})`,
            extra_info: null
          });
        });
      }

      unificadas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setSolicitudes(unificadas);
    } catch (err) {
      console.error("Error al cargar solicitudes", err);
    } finally {
      setLoadingDatos(false);
    }
  };

  const handleAprobar = async (solicitud) => {
    if (!window.confirm(`¿Estás seguro de que deseas aprobar este(a) ${solicitud.tipo}?`)) return;
    setMensaje(null);
    try {
      if (solicitud.tipo === 'venta') {
        await aprobarVenta(solicitud.id);
      } else {
        await aprobarPagoService(solicitud.id);
      }
      setMensaje({ type: 'success', text: 'Solicitud aprobada correctamente.' });
      cargarTodo();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al aprobar la solicitud.' });
    }
  };

  const handleRechazar = async (solicitud) => {
    if (!window.confirm(`¿Estás seguro de que deseas rechazar este(a) ${solicitud.tipo}?`)) return;
    setMensaje(null);
    try {
      if (solicitud.tipo === 'venta') {
        await rechazarVenta(solicitud.id);
      } else {
        await rechazarPagoService(solicitud.id);
      }
      setMensaje({ type: 'success', text: 'Solicitud rechazada correctamente.' });
      cargarTodo();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al rechazar la solicitud.' });
    }
  };

  const handleEliminar = async (solicitud) => {
    if (solicitud.tipo === 'pago') {
      window.alert("Los pagos no se pueden eliminar manualmente, solo rechazar.");
      return;
    }
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer y restará las clases si ya fue aprobada.")) return;
    
    setMensaje(null);
    try {
      await eliminarVenta(solicitud.id);
      setMensaje({ type: 'success', text: 'Venta eliminada correctamente.' });
      cargarTodo();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al eliminar la venta.' });
    }
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(monto || 0);
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

  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = (sol) => {
    let textMatch = true;
    if (searchTerm) {
      textMatch = (
        sol.user?.nombre?.toLowerCase().includes(searchLower) ||
        sol.user?.apellidos?.toLowerCase().includes(searchLower) ||
        sol.user?.email?.toLowerCase().includes(searchLower) ||
        sol.user?.rut?.toLowerCase().includes(searchLower) ||
        sol.concepto?.toLowerCase().includes(searchLower)
      );
    }
    let dateMatch = true;
    if (searchDate && sol.fecha) {
      const d = new Date(sol.fecha);
      const localDateStr = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      dateMatch = localDateStr === searchDate;
    }
    return textMatch && dateMatch;
  };

  const pendientes = solicitudes.filter(s => s.estado === 'pendiente' && matchesSearch(s));
  const historial = solicitudes.filter(s => {
    if (s.estado === 'pendiente') return false;
    if (!matchesSearch(s)) return false;
    if (filterEstadoHistorial === 'todas') return true;
    return s.estado === filterEstadoHistorial;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestión de Solicitudes y Pagos</h1>

      {mensaje && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${mensaje.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje.text}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMostrarHistorial(false)}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${!mostrarHistorial ? 'bg-[#2563eb] text-white ring-2 ring-offset-2 ring-blue-500' : 'bg-[#2563eb] text-white opacity-70 hover:opacity-100'}`}
        >
          Solicitudes Pendientes
        </button>
        <button 
          onClick={() => setMostrarHistorial(true)}
          className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${mostrarHistorial ? 'bg-[#00d0b0] text-teal-900 ring-2 ring-offset-2 ring-teal-400' : 'bg-[#00d0b0] text-teal-900 opacity-70 hover:opacity-100'}`}
        >
          Historial de Solicitudes
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Buscar por nombre, rut, email o concepto..." 
            className="input input-bordered w-full shadow-sm pl-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <div className="relative w-full sm:w-auto">
          <input 
            type="date" 
            className="input input-bordered w-full sm:w-auto shadow-sm bg-white"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            title="Filtrar por fecha"
          />
        </div>
        {(searchTerm || searchDate) && (
          <button 
            onClick={() => { setSearchTerm(''); setSearchDate(''); }}
            className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {!mostrarHistorial ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Solicitudes Pendientes (Ventas y Pagos)</h2>
          
          {loadingDatos ? (
            <p className="text-gray-500 text-center py-4">Cargando...</p>
          ) : pendientes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay solicitudes pendientes por revisar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Alumno</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Concepto</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Monto</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Comprobante</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-600 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendientes.map((sol) => (
                    <tr key={sol.id_ref} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 font-semibold uppercase">
                        {sol.tipo === 'venta' ? (
                          <span className="text-blue-600">Venta #{sol.id}</span>
                        ) : (
                          <span className="text-orange-600">Pago #{sol.id}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {sol.user ? (
                          <div>
                            <p className="font-medium">{sol.user.nombre} {sol.user.apellidos}</p>
                            <p className="text-xs text-gray-500">{sol.user.email}</p>
                          </div>
                        ) : 'Desconocido'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(sol.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                        {sol.concepto}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatearMonto(sol.monto)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <a 
                          href={`http://localhost:3000${sol.comprobante}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center font-medium"
                        >
                          Ver Foto
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-right space-x-2">
                        <button
                          onClick={() => handleAprobar(sol)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium transition"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazar(sol)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-medium transition"
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 rounded-b-none">
            <h2 className="text-xl font-semibold text-gray-700">Historial (Ventas y Pagos)</h2>
            <select 
              className="select select-bordered w-full sm:max-w-xs bg-white"
              value={filterEstadoHistorial}
              onChange={(e) => setFilterEstadoHistorial(e.target.value)}
            >
              <option value="todas">Todos los estados</option>
              <option value="aprobada">Aprobadas/Pagadas</option>
              <option value="rechazada">Rechazadas</option>
              <option value="vencida">Vencidas</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 rounded-t-none">
            {loadingDatos ? (
               <p className="text-gray-500 text-center py-4">Cargando...</p>
            ) : historial.length === 0 ? (
               <p className="text-gray-500 text-center py-4">No hay historial para el filtro seleccionado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Alumno</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Concepto</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Monto</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historial.map((sol) => (
                      <tr key={sol.id_ref} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-semibold uppercase">
                          {sol.tipo === 'venta' ? (
                            <span className="text-blue-600">Venta #{sol.id}</span>
                          ) : (
                            <span className="text-orange-600">Pago #{sol.id}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {sol.user ? (
                            <div>
                              <p className="font-medium">{sol.user.nombre} {sol.user.apellidos}</p>
                              <p className="text-xs text-gray-500">{sol.user.email}</p>
                            </div>
                          ) : 'Desconocido'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(sol.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          {sol.concepto}
                          {sol.extra_info && (
                            <span className="text-xs text-gray-500 block">{sol.extra_info}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatearMonto(sol.monto)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sol.estado === 'aprobada' || sol.estado === 'pagado' ? 'bg-green-100 text-green-800' : 
                            sol.estado === 'vencida' ? 'bg-gray-200 text-gray-600' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sol.estado ? sol.estado.charAt(0).toUpperCase() + sol.estado.slice(1) : 'Desconocido'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <a 
                            href={`http://localhost:3000${sol.comprobante}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center font-medium"
                          >
                            Ver Foto
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

