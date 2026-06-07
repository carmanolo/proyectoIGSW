import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getReservas, updateReservaEstado, createReserva, getUsuarios, getVehiculos } from '@services/reserva.service';
import { getClasesService } from '@services/clase.service';

export default function GestionClasesSecretaria() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');


  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clases, setClases] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    vehiculoId: '',
    claseId: '',
    fecha: '',
    tipo: 'clase_regular'
  });

  useEffect(() => {
    if (user?.rol === 'secretario') {
      cargarDatosIniciales();
    }
  }, [user]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [resReservas, resUsuarios, resVehiculos, resClases] = await Promise.all([
        getReservas(),
        getUsuarios(),
        getVehiculos(),
        getClasesService()
      ]);

      if (resReservas?.data) setReservas(resReservas.data);

      // Los usuarios vienen anidados en data.data o data dependiendo del servicio
      let usuariosArr = [];
      if (resUsuarios?.data?.data && Array.isArray(resUsuarios.data.data)) {
        usuariosArr = resUsuarios.data.data;
      } else if (resUsuarios?.data && Array.isArray(resUsuarios.data)) {
        usuariosArr = resUsuarios.data;
      }
      setUsuarios(usuariosArr.filter(u => u.rol === 'alumnos'));

      if (resVehiculos?.data) setVehiculos(resVehiculos.data);

      // Las clases vienen como [ [clases], null ]
      let clasesArr = [];
      if (Array.isArray(resClases) && Array.isArray(resClases[0])) {
        clasesArr = resClases[0];
      } else if (Array.isArray(resClases)) {
        clasesArr = resClases;
      }
      setClases(clasesArr);
      
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      const result = await updateReservaEstado(id, nuevoEstado);
      if (result && result.data) {
        setReservas(reservas.map(res => res.id === id ? { ...res, estado: nuevoEstado } : res));
      } else {
        alert(result.message || "Error al actualizar estado");
      }
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createReserva(formData);
      if (res?.data) {
        alert("Clase agendada exitosamente");
        setShowModal(false);
        cargarDatosIniciales(); // Recargar lista
      } else {
        alert(res?.message || "Error al agendar la clase");
      }
    } catch (err) {
      alert("Error al agendar la clase");
    }
  };

  if (user?.rol !== 'secretario') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página.
        </div>
      </div>
    );
  }

  const filteredReservas = reservas.filter(reserva => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = reserva.user?.nombre?.toLowerCase() || '';
    const studentEmail = reserva.user?.email?.toLowerCase() || '';
    const matchesSearch = studentName.includes(searchLower) || studentEmail.includes(searchLower);
    
    const tipoReserva = (reserva.tipo || '').toLowerCase();
    const matchesFiltro = filtroTipo === 'todos' || 
                          (filtroTipo === 'clase_extra' && tipoReserva === 'clase_extra') ||
                          (filtroTipo === 'regular' && tipoReserva !== 'clase_extra');
                          
    return matchesSearch && matchesFiltro;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clases Alumnos</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Agendar Clase
        </button>
      </div>
      
      <div className="mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Buscar alumno por nombre o email..." 
          className="input input-bordered w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="select select-bordered" 
          value={filtroTipo} 
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos los tipos</option>
          <option value="regular">Clases Regulares</option>
          <option value="clase_extra">Clases Extras</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Alumno</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Vehículo</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado Actual</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{reserva.user?.nombre}</div>
                      <div className="text-xs text-gray-500">{reserva.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(reserva.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {reserva.tipo === 'clase_extra' ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold border border-purple-300 shadow-sm flex items-center gap-1 w-fit">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" /></svg>
                          CLASE EXTRA
                        </span>
                      ) : (
                        <span className="text-gray-700 uppercase">{reserva.clase ? reserva.clase.tipo : reserva.tipo}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {reserva.vehiculo ? `${reserva.vehiculo.patente} - ${reserva.vehiculo.transmision}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        reserva.estado === 'no_realizada' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reserva.estado.replace('_', ' ').charAt(0).toUpperCase() + reserva.estado.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select 
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={reserva.estado}
                        onChange={(e) => handleEstadoChange(reserva.id, e.target.value)}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="completada">Completada</option>
                        <option value="no_realizada">No Realizada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReservas.length === 0 && (
              <div className="text-center py-6 text-gray-500">No se encontraron clases reservadas.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal Agendar Clase */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Agendar Nueva Clase</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alumno</label>
                <select required className="select select-bordered w-full mt-1" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}>
                  <option value="" disabled>Seleccione un alumno</option>
                  {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Clase Base</label>
                <select 
                  required 
                  className="select select-bordered w-full mt-1" 
                  value={formData.claseId} 
                  onChange={e => {
                    const selectedId = e.target.value;
                    const selectedClase = clases.find(c => c.id_clase.toString() === selectedId);
                    setFormData({
                      ...formData, 
                      claseId: selectedId,
                      fecha: selectedClase ? selectedClase.fecha_clase : ''
                    });
                  }}
                >
                  <option value="" disabled>Seleccione una clase (teórica/práctica)</option>
                  {clases.map(c => (
                    <option key={c.id_clase} value={c.id_clase}>
                      {c.tipo} - {c.dia} {new Date(c.fecha_clase).toLocaleDateString()} a las {c.hora_inicio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vehículo</label>
                <select required className="select select-bordered w-full mt-1" value={formData.vehiculoId} onChange={e => setFormData({...formData, vehiculoId: e.target.value})}>
                  <option value="" disabled>Seleccione un vehículo</option>
                  {vehiculos.map(v => <option key={v.id} value={v.id}>{v.patente} - {v.transmision}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Reserva</label>
                <select className="select select-bordered w-full mt-1" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                  <option value="clase_regular">Clase Regular</option>
                  <option value="pre_evaluacion">Pre-Evaluación</option>
                  <option value="clase_extra">Clase Extra (Usa saldo del alumno)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
