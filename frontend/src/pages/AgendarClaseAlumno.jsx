import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { createReserva, getVehiculos, getOcupacionVehiculos } from '@services/reserva.service';
import { getClasesService } from '@services/clase.service';
import { getUser } from '@services/profile.service';
import { useNavigate } from 'react-router-dom';

export default function AgendarClaseAlumno() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [clases, setClases] = useState([]);
  const [clasesDisponibles, setClasesDisponibles] = useState(0);
  const [ocupacion, setOcupacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    vehiculoId: '',
    claseId: '',
    fecha: '',
    tipo: 'clase_regular'
  });

  useEffect(() => {
    if (user?.id) {
      cargarDatosIniciales();
    }
  }, [user]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      const [resVehiculos, resClases, resUser, resOcupacion] = await Promise.all([
        getVehiculos(),
        getClasesService(),
        getUser(user.id),
        getOcupacionVehiculos()
      ]);

      if (resVehiculos?.data) setVehiculos(resVehiculos.data);
      if (resOcupacion?.data) setOcupacion(resOcupacion.data);

      let clasesArr = [];
      if (Array.isArray(resClases) && Array.isArray(resClases[0])) {
        clasesArr = resClases[0];
      } else if (Array.isArray(resClases)) {
        clasesArr = resClases;
      }
      setClases(clasesArr);

      if (resUser?.data?.data) {
        setClasesDisponibles(resUser.data.data.clases_disponibles || 0);
      }
      
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.tipo === 'clase_extra' && clasesDisponibles <= 0) {
        alert("No tienes saldo de clases extras disponible.");
        return;
    }

    try {
      const res = await createReserva({ ...formData, userId: user.id });
      if (res?.data) {
        alert("Clase agendada exitosamente");
        navigate("/historial-clases");
      } else {
        alert(res?.message || "Error al agendar la clase");
      }
    } catch (err) {
      alert("Error al agendar la clase");
    }
  };

  if (user?.rol !== 'alumnos') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Agendar Nueva Clase</h1>
        <div className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg flex items-center shadow-sm">
          <span className="text-blue-800 font-medium">Clases Extras Disponibles:</span>
          <span className="ml-2 bg-blue-600 text-white text-lg font-bold px-3 py-1 rounded-md">
            {clasesDisponibles}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clase Base (Día y Horario)</label>
              <select 
                required 
                className="select select-bordered w-full" 
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
                <option value="" disabled>Seleccione una clase disponible</option>
                {clases.map(c => (
                  <option key={c.id_clase} value={c.id_clase}>
                    {c.tipo} - {c.dia} {new Date(c.fecha_clase).toLocaleDateString()} a las {c.hora_inicio}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehículo Preferido</label>
              <select required className="select select-bordered w-full" value={formData.vehiculoId} onChange={e => setFormData({...formData, vehiculoId: e.target.value})}>
                <option value="" disabled>Seleccione un vehículo</option>
                {vehiculos.map(v => {
                  const isOccupied = formData.claseId && ocupacion.some(o => 
                    o.vehiculo?.id === v.id && o.clase?.id_clase === Number(formData.claseId)
                  );
                  return (
                    <option key={v.id} value={v.id} disabled={isOccupied}>
                      {v.patente} - {v.transmision} {isOccupied ? '(Ocupado)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reserva</label>
              <select className="select select-bordered w-full" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="clase_regular">Clase Regular</option>
                <option value="clase_extra" disabled={clasesDisponibles <= 0}>
                  Clase Extra (Usa tu saldo disponible) {clasesDisponibles <= 0 ? '(Sin saldo)' : ''}
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/historial-clases")}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Agendar Clase</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
