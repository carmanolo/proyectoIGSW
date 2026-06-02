import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { getVehiculos, createVehiculo, deleteVehiculo } from '@services/vehiculo.service';

export default function GestionVehiculosSecretaria() {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patente: '',
    transmision: 'mecanico'
  });

  useEffect(() => {
    if (user?.rol === 'secretario') {
      cargarVehiculos();
    }
  }, [user]);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const res = await getVehiculos();
      if (res?.data) {
        setVehiculos(res.data);
      } else {
        setVehiculos([]);
      }
    } catch (err) {
      setError("Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createVehiculo(formData);
      if (res?.data) {
        alert("Vehículo registrado exitosamente");
        setShowModal(false);
        setFormData({ patente: '', transmision: 'mecanico' });
        cargarVehiculos(); // Recargar lista
      } else {
        alert(res?.message || "Error al registrar vehículo");
      }
    } catch (err) {
      alert("Error al registrar vehículo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este vehículo? Esto fallará si el auto tiene clases agendadas.")) return;
    
    try {
      const res = await deleteVehiculo(id);
      if (res?.status === "Success" || res?.message?.includes("exitosamente")) {
        alert("Vehículo eliminado");
        cargarVehiculos();
      } else {
        alert(res?.message || "Error al eliminar vehículo");
      }
    } catch (err) {
      alert("Error al eliminar vehículo");
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Vehículos</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Agregar Vehículo
        </button>
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
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Patente</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Transmisión</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-600 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{vehiculo.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{vehiculo.patente}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 uppercase">{vehiculo.transmision}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {vehiculo.estado || 'DISPONIBLE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        className="btn btn-sm btn-error text-white"
                        onClick={() => handleDelete(vehiculo.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vehiculos.length === 0 && (
              <div className="text-center py-6 text-gray-500">No hay vehículos registrados en la flota.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal Agregar Vehículo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patente</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Ej: AB-CD-12"
                  className="input input-bordered w-full mt-1" 
                  value={formData.patente} 
                  onChange={e => setFormData({...formData, patente: e.target.value.toUpperCase()})} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Transmisión</label>
                <select 
                  className="select select-bordered w-full mt-1" 
                  value={formData.transmision} 
                  onChange={e => setFormData({...formData, transmision: e.target.value})}
                >
                  <option value="mecanico">Manual</option>
                  <option value="automatico">Automático</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
