import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { getVehiculos } from "@services/vehiculo.service";
import { createIncidenciaService, getIncidenciasService } from "@services/incidencia.service";
import Swal from "sweetalert2";

export default function ReporteVehiculoProfesor() {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehiculo_id: "",
    tipo: "falla_mecanica",
    kilometraje_actual: "",
    descripcion: "",
  });

  useEffect(() => {
    if (user?.rol === "profesor") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [vehRes, incRes] = await Promise.all([
        getVehiculos(),
        getIncidenciasService()
      ]);
      if (vehRes?.data) setVehiculos(vehRes.data);
      if (incRes) setIncidencias(incRes);
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehiculo_id || !formData.tipo || !formData.descripcion) {
      Swal.fire("Error", "Debes completar vehículo, tipo y descripción", "error");
      return;
    }

    setLoading(true);
    try {
      await createIncidenciaService(formData);
      Swal.fire("Éxito", "Reporte enviado correctamente", "success");
      setFormData({
        vehiculo_id: "",
        tipo: "falla_mecanica",
        kilometraje_actual: "",
        descripcion: "",
      });
      fetchData(); // recargar historial
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo enviar el reporte", "error");
    } finally {
      setLoading(false);
    }
  };

  if (user?.rol !== "profesor") {
    return <div className="p-4 text-red-500">Acceso denegado. Solo profesores.</div>;
  }

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'pendiente': return <span className="badge badge-warning">Pendiente</span>;
      case 'en_revision': return <span className="badge badge-info">En Revisión</span>;
      case 'resuelto': return <span className="badge badge-success">Resuelto</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Reporte de Vehículo (Incidencias)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Nuevo Reporte</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Vehículo asignado</span></label>
              <select name="vehiculo_id" value={formData.vehiculo_id} onChange={handleChange} className="select select-bordered w-full">
                <option value="" disabled>Selecciona el vehículo</option>
                {vehiculos.map(v => (
                  <option key={v.id} value={v.id}>{v.patente} - {v.transmision}</option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Tipo de Incidencia</span></label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="select select-bordered w-full">
                <option value="falla_mecanica">Falla Mecánica</option>
                <option value="choque">Choque / Accidente</option>
                <option value="combustible">Carga de Combustible</option>
                <option value="kilometraje">Reporte de Kilometraje</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Kilometraje Actual (opcional)</span></label>
              <input type="number" name="kilometraje_actual" value={formData.kilometraje_actual} onChange={handleChange} placeholder="Ej. 45000" className="input input-bordered w-full" />
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Descripción Detallada</span></label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="textarea textarea-bordered h-24" placeholder="Describe el problema, monto cargado de combustible, etc..."></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Enviando..." : "Enviar Reporte"}
            </button>
          </form>
        </div>

        {/* Historial */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Mis Reportes Anteriores</h2>
          <div className="overflow-x-auto h-96">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Patente</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-gray-500 py-4">No has enviado reportes.</td></tr>
                ) : (
                  incidencias.map(inc => (
                    <tr key={inc.id}>
                      <td>{new Date(inc.fecha_reporte).toLocaleDateString()}</td>
                      <td>{inc.vehiculo?.patente}</td>
                      <td className="capitalize">{inc.tipo.replace('_', ' ')}</td>
                      <td>{getEstadoBadge(inc.estado)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
