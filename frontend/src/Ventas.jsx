import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Ventas.css';

// ── Iconos SVG inline ──────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    ticket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" /><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
      </svg>
    ),
    upload: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    clock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ── Configurador de API Axios ──────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Vistas Principales ─────────────────────────────────────────────────────
export default function VentasView({ user }) {
  if (user.role === 'alumnos') {
    return <AlumnoVentas user={user} />;
  } else if (user.role === 'secretario') {
    return <SecretarioVentas user={user} />;
  }
  return <div className="ventas-msg">Rol no autorizado para esta vista.</div>;
}

// ── Vista para ALUMNO ──────────────────────────────────────────────────────
function AlumnoVentas({ user }) {
  const [clasesDisponibles, setClasesDisponibles] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [file, setFile] = useState(null);
  const [comprando, setComprando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resClases, resHistorial] = await Promise.all([
        api.get(`/ventas/user/${user.id}`),
        api.get(`/ventas/user/${user.id}/records`)
      ]);
      setClasesDisponibles(resClases.data.data.clases_disponibles);
      setHistorial(resHistorial.data.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || cantidad < 1) return;

    setComprando(true);
    setMensaje(null);
    try {
      // Simulamos la subida de archivo al generar una URL falsa
      // En un entorno real, primero subiríamos el 'file' a un servicio S3 o multer y obtendríamos la URL
      const fakeUrl = `https://storage.miservidor.com/comprobantes/${Date.now()}_${file.name}`;
      
      await api.post('/ventas/pack', {
        userId: user.id,
        cantidad: Number(cantidad),
        comprobante_url: fakeUrl
      });
      
      setMensaje({ tipo: 'exito', texto: 'Solicitud enviada exitosamente. Pendiente de aprobación.' });
      setCantidad(1);
      setFile(null);
      fetchData(); // Refrescar el historial
    } catch (error) {
      console.error("Error al comprar:", error);
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al procesar la compra.' });
    } finally {
      setComprando(false);
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const renderStatus = (venta) => {
    if (venta.estado === 'Aprobada') {
      return <span className="status-badge status-approved"><Icon name="check" size={12}/> Aprobada</span>;
    }
    if (venta.estado === 'Pendiente') {
      return <span className="status-badge status-pending"><Icon name="clock" size={12}/> Pendiente</span>;
    }
    return <span className="status-badge status-rejected"><Icon name="x" size={12}/> {venta.estado}</span>;
  };

  if (loading) return <div className="ventas-loading">Cargando datos...</div>;

  return (
    <div className="ventas-container">
      <div className="ventas-grid-alumno">
        {/* Tarjeta de Clases */}
        <div className="ventas-card card-destacada">
          <div className="card-header">
            <h3>Clases Disponibles</h3>
            <div className="icon-circle bg-blue"><Icon name="ticket" size={24} /></div>
          </div>
          <div className="card-body centered">
            <h1 className="clases-count">{clasesDisponibles}</h1>
            <p className="clases-sub">Clases listas para agendar</p>
          </div>
        </div>

        {/* Formulario de Compra */}
        <div className="ventas-card">
          <div className="card-header">
            <h3>Solicitar Más Clases</h3>
          </div>
          <div className="card-body">
            {mensaje && (
              <div className={`ventas-alert ${mensaje.tipo}`}>
                {mensaje.texto}
              </div>
            )}
            <form onSubmit={handleSubmit} className="ventas-form">
              <div className="form-group">
                <label>Cantidad de Clases</label>
                <div className="number-input-wrap">
                  <button type="button" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                  <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" />
                  <button type="button" onClick={() => setCantidad(Number(cantidad) + 1)}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Comprobante de Pago</label>
                <div className="file-upload-wrapper">
                  <input type="file" id="comprobante" accept="image/*,.pdf" onChange={handleFileChange} />
                  <label htmlFor="comprobante" className="file-upload-label">
                    <Icon name="upload" size={20} />
                    <span>{file ? file.name : 'Haz clic para subir comprobante'}</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary full-width" disabled={comprando || !file || cantidad < 1}>
                {comprando ? 'Procesando...' : 'Enviar Solicitud'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="ventas-card full-width">
        <div className="card-header">
          <h3>Historial de Solicitudes</h3>
        </div>
        <div className="card-body no-padding">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Comprobante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No tienes solicitudes previas.</td>
                </tr>
              ) : (
                historial.map((venta) => (
                  <tr key={venta.id}>
                    <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                    <td>{venta.cantidad} clases</td>
                    <td><a href={venta.comprobante_url} target="_blank" rel="noreferrer" className="link-comprobante">Ver archivo</a></td>
                    <td>{renderStatus(venta)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Vista para SECRETARIO ──────────────────────────────────────────────────
function SecretarioVentas({ user }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ventas');
      setVentas(res.data.data || []);
    } catch (error) {
      console.error("Error al cargar ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      if (action === 'aprobar') {
        await api.patch(`/ventas/${id}/aprobar`);
      } else if (action === 'rechazar') {
        await api.delete(`/ventas/${id}`);
      }
      fetchVentas();
    } catch (error) {
      console.error(`Error al ${action} venta:`, error);
      alert(`Error al ${action} la venta. Verifica la consola.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="ventas-loading">Cargando solicitudes...</div>;

  return (
    <div className="ventas-container">
      <div className="ventas-card full-width">
        <div className="card-header">
          <h3>Gestión de Solicitudes de Clases Extras</h3>
        </div>
        <div className="card-body no-padding">
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Alumno</th>
                <th>Cantidad</th>
                <th>Comprobante</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No hay solicitudes registradas.</td>
                </tr>
              ) : (
                ventas.map((venta) => (
                  <tr key={venta.id}>
                    <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                    <td>{venta.user?.nombreCompleto || 'Desconocido'} ({venta.user?.email})</td>
                    <td><strong>{venta.cantidad}</strong></td>
                    <td>
                      <a href={venta.comprobante_url} target="_blank" rel="noreferrer" className="link-comprobante">
                        Ver archivo
                      </a>
                    </td>
                    <td>
                      {venta.estado === 'Pendiente' ? (
                        <span className="status-badge status-pending">Pendiente</span>
                      ) : (
                        <span className="status-badge status-approved">Aprobada</span>
                      )}
                    </td>
                    <td>
                      {venta.estado === 'Pendiente' ? (
                        <div className="action-buttons">
                          <button 
                            className="btn-icon btn-success" 
                            onClick={() => handleAction(venta.id, 'aprobar')}
                            disabled={actionLoading === venta.id}
                            title="Aprobar"
                          >
                            <Icon name="check" size={16} />
                          </button>
                          <button 
                            className="btn-icon btn-danger" 
                            onClick={() => handleAction(venta.id, 'rechazar')}
                            disabled={actionLoading === venta.id}
                            title="Rechazar/Eliminar"
                          >
                            <Icon name="x" size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">Procesada</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
