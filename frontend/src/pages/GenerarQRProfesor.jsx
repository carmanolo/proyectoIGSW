import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import QRCode from 'qrcode';
import axios from '@services/root.service.js';

export default function GenerarQRProfesor() {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Obtener las clases
    const fetchClases = async () => {
      try {
        const response = await axios.get('/clases');
        const esSecretario = user?.rol?.toLowerCase() === 'secretario';
        const misClases = response.data.data.filter(c => {
          if (esSecretario) return true;
          return c.profesores && c.profesores.id === user.id;
        });
        setClases(misClases);
      } catch (err) {
        console.error('Error fetching clases', err);
        setError('Error al cargar tus clases');
      }
    };
    if (user) {
      fetchClases();
    }
  }, [user]);

  const handleGenerarQR = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!claseSeleccionada) {
      setError('Por favor selecciona una clase');
      setLoading(false);
      return;
    }

    try {
      // El QR solo contendrá el ID de la clase
      const qrData = JSON.stringify({ claseId: claseSeleccionada });

      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrUrl);
    } catch (err) {
      setError('Error al generar el código QR');
      console.error('Error generando QR:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="card bg-base-100 shadow-xl p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Generar QR de Asistencia</h1>
        <p className="text-gray-600 mb-4">
          {user?.rol?.toLowerCase() === 'secretario' ? 'Secretario:' : 'Profesor:'} <strong>{user?.nombre}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Selecciona una clase para generar el código QR. Los alumnos podrán escanear este código para marcar su asistencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Seleccionar Clase</h2>
          {error && <div className="alert alert-error mb-4">{error}</div>}

          <form onSubmit={handleGenerarQR}>
            <div className="form-control w-full mb-4">
              <label className="label">
                <span className="label-text">Clase *</span>
              </label>
              <select 
                className="select select-bordered w-full text-ellipsis overflow-hidden"
                value={claseSeleccionada}
                onChange={(e) => {
                  setClaseSeleccionada(e.target.value);
                  setQrCodeUrl('');
                }}
                disabled={loading}
              >
                <option value="">Seleccione una clase...</option>
                {clases.map(c => (
                  <option key={c.id_clase} value={c.id_clase}>
                    {c.tipo.toUpperCase()} | {c.fecha_clase} | {c.hora_inicio} - {c.hora_fin} {user?.rol?.toLowerCase() === 'secretario' && c.profesores ? ` | Prof: ${c.profesores.nombre.split(' ')[0]}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={loading || !claseSeleccionada}
            >
              {loading ? 'Generando...' : 'Generar QR'}
            </button>
          </form>
        </div>

        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Código QR</h2>
          {!qrCodeUrl ? (
            <div className="flex flex-col items-center justify-center h-48 bg-base-200 rounded-lg border-2 border-dashed border-base-300 p-4 text-center text-gray-500">
              <p>El código QR aparecerá aquí una vez que selecciones una clase y presiones Generar.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-inner mb-4">
                <img src={qrCodeUrl} alt="QR Code Asistencia" className="max-w-full rounded" />
              </div>
              <div className="alert alert-success shadow-sm mb-4">
                <span>✓ Código QR listo para escanear</span>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Muestra esta pantalla a tus alumnos para que registren su asistencia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
