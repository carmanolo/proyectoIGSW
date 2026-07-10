import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { useVentas } from '../hooks/useVentas';
import { obtenerInscripcionesPorAlumnoService } from "@services/inscripciones.service";
import { solicitarPagoService, listarMisPagosService } from "@services/pago.service";
import { registrarVentaService, obtenerClasesUsuarioService, simularVencimientoService } from '../services/venta.service';
import Swal from "sweetalert2";

export default function ComprarClases() {
  const { user } = useAuth();
  const { getClasesDisponibles, getHistorialVentas, comprarPack, loading } = useVentas();
  
  const [clasesDisponibles, setClasesDisponibles] = useState(0);
  const [clasesPracticasCompletadas, setClasesPracticasCompletadas] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [pagosPendientes, setPagosPendientes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [cantidad, setCantidad] = useState(2);
  const [tipoPago, setTipoPago] = useState('contado');
  const [cuotas, setCuotas] = useState(2);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user]);

  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      const [resClases, resHistorial, resInscripciones, resPagos] = await Promise.allSettled([
        getClasesDisponibles(user.id),
        getHistorialVentas(user.id),
        obtenerInscripcionesPorAlumnoService(user.id),
        listarMisPagosService()
      ]);

      if (resClases.status === 'fulfilled' && resClases.value) {
        const dataClases = resClases.value;
        if (dataClases?.data?.data) {
          setClasesDisponibles(dataClases.data.data.clases_disponibles || 0);
          setClasesPracticasCompletadas(dataClases.data.data.clases_practicas_completadas || 0);
        } else if (dataClases?.data) {
          setClasesDisponibles(dataClases.data.clases_disponibles || 0);
          setClasesPracticasCompletadas(dataClases.data.clases_practicas_completadas || 0);
        } else {
          setClasesDisponibles(dataClases?.clases_disponibles || 0);
          setClasesPracticasCompletadas(dataClases?.clases_practicas_completadas || 0);
        }
      }

      let dataHistorial = [];
      if (resHistorial.status === 'fulfilled' && resHistorial.value) {
        dataHistorial = Array.isArray(resHistorial.value) ? resHistorial.value : (resHistorial.value?.data || []);
        setHistorial(dataHistorial);
      }

      let deudasActivas = [];
      if (resInscripciones.status === 'fulfilled' && resInscripciones.value?.data) {
        deudasActivas = resInscripciones.value.data.filter(
          (ins) => ins.estado_pago === "pendiente" || ins.estado_pago === "parcial"
        );
      }

      if (dataHistorial.length > 0) {
        const ventasDeuda = dataHistorial.filter(
          (venta) => venta.tipo_pago === "plazo" && venta.estado === "aprobada"
        );
        deudasActivas = [...deudasActivas, ...ventasDeuda];
      }

      setDeudas(deudasActivas);

      if (resPagos.status === 'fulfilled' && resPagos.value?.data) {
        setPagosPendientes(resPagos.value.data);
      }

    } catch (err) {
      console.error("Error al cargar datos", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    if (!cantidad || (tipoPago === 'contado' && !comprobanteFile)) {
      setMensaje({ type: 'error', text: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('cantidad', Number(cantidad));
      formData.append('tipo_pago', tipoPago);
      if (tipoPago === 'plazo') {
        formData.append('cuotas', Number(cuotas));
      }
      if (comprobanteFile) {
        formData.append('comprobante', comprobanteFile);
      }

      await comprarPack(formData);
      
      setMensaje({ type: 'success', text: 'Solicitud enviada correctamente. Pendiente de aprobación.' });
      setCantidad(2);
      setComprobanteFile(null);
      const comprobanteInput = document.getElementById('comprobante-input');
      if (comprobanteInput) comprobanteInput.value = '';
      cargarDatos();
    } catch (err) {
      setMensaje({ type: 'error', text: err.message || 'Error al enviar la solicitud.' });
    }
  };

  const handlePagar = (inscripcion) => {
    const isVenta = !!inscripcion.id && !inscripcion.id_inscripcion;
    const saldo = Number(inscripcion.monto_total || 0) - Number(inscripcion.monto_pagado || 0);
    const tipo_deuda = isVenta ? "venta" : "inscripcion";
    const deuda_id = isVenta ? inscripcion.id : inscripcion.id_inscripcion;
    const defaultMonto = inscripcion.cuotas ? Math.min(Math.round(inscripcion.monto_total / inscripcion.cuotas), saldo) : saldo;

    let cuotaInfoHTML = "";
    if (inscripcion.cuotas) {
      const valorCuota = Math.round(inscripcion.monto_total / inscripcion.cuotas);
      const cuotasPagadas = Math.floor((inscripcion.monto_pagado || 0) / valorCuota);
      const cuotaActual = Math.min(cuotasPagadas + 1, inscripcion.cuotas);
      cuotaInfoHTML = `<p class="text-sm font-medium text-blue-600 mb-2">Estás pagando la cuota ${cuotaActual} de ${inscripcion.cuotas}</p>`;
    }

    Swal.fire({
      title: "Pagar Cuota",
      html: `
        <div class="text-left">
          <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-5">
            <h3 class="text-blue-900 font-semibold mb-1">Detalle de la Deuda</h3>
            <p class="text-sm text-blue-800 mb-1"><span class="opacity-75">Concepto:</span> ${inscripcion.plan?.nombre_plan || (inscripcion.cantidad ? 'Pack de ' + inscripcion.cantidad + ' Clases Extra' : "Curso de Conducir")}</p>
            ${cuotaInfoHTML ? `<p class="text-sm font-semibold text-blue-700 mb-1">${cuotaInfoHTML.replace(/<[^>]*>?/gm, '')}</p>` : ''}
            <p class="text-sm text-blue-800"><span class="opacity-75">Saldo restante:</span> <strong class="text-lg">$${saldo.toLocaleString('es-CL')}</strong></p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto a transferir en esta cuota</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-medium">$</span>
                <input type="number" id="monto_pagar" class="input input-bordered w-full pl-8 focus:ring-2 focus:ring-blue-500 text-lg font-medium" min="1000" max="${saldo}" value="${defaultMonto}" />
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Comprobante de transferencia</label>
              <input type="file" id="comprobante" class="file-input file-input-bordered file-input-primary w-full bg-white" accept="image/*,application/pdf" />
              <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Sube el comprobante por el monto exacto ingresado arriba.
              </p>
            </div>
          </div>
        </div>
      `,
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'btn btn-primary text-white px-6 rounded-lg',
        cancelButton: 'btn btn-ghost px-6 rounded-lg'
      },
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Enviar Comprobante",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const fileInput = Swal.getPopup().querySelector('#comprobante');
        const montoInput = Swal.getPopup().querySelector('#monto_pagar');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
          Swal.showValidationMessage('Debes adjuntar un comprobante');
          return false;
        }
        if (!montoInput || !montoInput.value || Number(montoInput.value) <= 0 || Number(montoInput.value) > saldo) {
          Swal.showValidationMessage('Monto a pagar inválido. Debe ser menor o igual al saldo pendiente.');
          return false;
        }

        const formData = new FormData();
        formData.append("comprobante", fileInput.files[0]);
        formData.append("monto", montoInput.value);
        formData.append("tipo_deuda", tipo_deuda);
        formData.append("deuda_id", deuda_id);

        try {
          await solicitarPagoService(formData);
        } catch (error) {
          Swal.showValidationMessage('Error al enviar el comprobante: ' + (error.message || 'Intente nuevamente'));
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "¡Enviado!",
          "Tu comprobante está en revisión por secretaría.",
          "success"
        );
        cargarDatos();
      }
    });
  };

  const handleSimularVencimiento = async (id) => {
    try {
      await simularVencimientoService(id);
      Swal.fire("Vencimiento simulado", "La fecha de vencimiento de esta cuota se ha atrasado artificialmente para la presentación.", "success");
      cargarDatos();
    } catch (error) {
      Swal.fire("Error", "No se pudo simular el vencimiento", "error");
    }
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(monto || 0);
  };

  if (user?.rol !== 'estudiante') {
    return (
      <div className="flex justify-center mt-10">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          No tienes permisos para ver esta página.
        </div>
      </div>
    );
  }

  if (loadingData) {
    return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Comprar Clases y Pagos</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: Comprar Clases Extras */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Tus Clases Disponibles</h2>
            <div className="text-4xl font-bold text-green-600">
              {clasesDisponibles}
            </div>
            <p className="text-sm text-gray-500 mt-2">Clases listas para agendar</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Solicitar Pack</h2>
            
            {mensaje && (
              <div className={`p-3 rounded-lg mb-4 text-sm ${mensaje.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {mensaje.text}
              </div>
            )}

            {clasesPracticasCompletadas < 6 ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">
                  <strong>No cumples con los requisitos:</strong> Tienes {clasesPracticasCompletadas} clases completadas y necesitas al menos 6 para poder comprar packs de clases extra.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de clases</label>
                    <select
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                      required
                    >
                      <option value="2">Pack de 2 clases</option>
                      <option value="4">Pack de 4 clases</option>
                      <option value="6">Pack de 6 clases</option>
                      <option value="8">Pack de 8 clases</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Monto a transferir:</span>
                    <span className="text-xl font-bold text-gray-800">
                      {(Number(cantidad) * 15000).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 bg-white"
                      value={tipoPago}
                      onChange={(e) => setTipoPago(e.target.value)}
                    >
                      <option value="contado">Al Contado</option>
                      <option value="plazo">A Plazo</option>
                    </select>
                  </div>

                  {tipoPago === 'plazo' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Cuotas</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 bg-white"
                        value={cuotas}
                        onChange={(e) => setCuotas(e.target.value)}
                      >
                        <option value="2">2 cuotas</option>
                        <option value="3">3 cuotas</option>
                        <option value="4">4 cuotas</option>
                        <option value="6">6 cuotas</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        La primera cuota se paga después de ser aprobada la solicitud.
                      </p>
                    </div>
                  )}

                  {tipoPago === 'contado' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante</label>
                      <input
                        id="comprobante-input"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setComprobanteFile(e.target.files[0])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center transition-colors
                      ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </>
                    ) : (
                      'Enviar Solicitud'
                    )}
                  </button>
              </form>
            )}
          </div>
        </div>

        {/* COLUMNA 2 y 3: Deudas y Historial */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Deudas Pendientes (Si hay) */}
          {deudas.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Deudas Pendientes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deudas.map((ins) => {
                  const isVenta = !!ins.id && !ins.id_inscripcion;
                  const tipo_deuda = isVenta ? "venta" : "inscripcion";
                  const deuda_id = isVenta ? ins.id : ins.id_inscripcion;
                  const saldo = Number(ins.monto_total || 0) - Number(ins.monto_pagado || 0);
                  const porcentajePagado = Math.min(100, Math.round((Number(ins.monto_pagado || 0) / Number(ins.monto_total || 1)) * 100));

                  const pagoPendiente = pagosPendientes.find(p => p.tipo_deuda === tipo_deuda && p.deuda_id === deuda_id);

                  const isVencida = ins.fecha_vencimiento && new Date(ins.fecha_vencimiento) < new Date();

                  return (
                    <div key={ins.id_inscripcion || ins.id} className={`border rounded-xl p-4 ${isVencida ? 'border-red-500 bg-red-50' : 'border-orange-100 bg-orange-50/50'}`}>
                      {isVencida && (
                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                          🔴 CUOTA VENCIDA
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {ins.plan?.nombre_plan || (ins.cantidad ? 'Pack de ' + ins.cantidad + ' Clases Extra' : "Curso de Conducir")}
                      </h3>
                      
                      {ins.fecha_vencimiento && (
                        <p className={`text-xs mb-2 font-medium ${isVencida ? 'text-red-600' : 'text-gray-500'}`}>
                          Vence el: {new Date(ins.fecha_vencimiento).toLocaleDateString()}
                        </p>
                      )}

                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Total: {formatearMonto(ins.monto_total)}</span>
                        <span className="font-semibold text-orange-600">Deuda: {formatearMonto(saldo)}</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: porcentajePagado + '%' }}></div>
                      </div>

                      {pagoPendiente ? (
                        <div className="text-center py-2 px-4 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium border border-yellow-200">
                          Pago en revisión ⏳
                        </div>
                      ) : (
                        <button 
                          onClick={() => handlePagar(ins)}
                          className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white w-full border-none"
                        >
                          Pagar Ahora
                        </button>
                      )}
                      
                      {isVenta && (
                        <button 
                          onClick={() => handleSimularVencimiento(ins.id)}
                          className="btn btn-xs btn-outline btn-error w-full mt-2"
                          title="Botón de prueba para la presentación"
                        >
                          Simular Vencimiento (Demo)
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historial de Compras */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Compras</h2>
            
            {historial.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tienes solicitudes previas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Plan / Clases</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Comprobante</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado / Vence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historial.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(venta.fecha_venta).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                          {venta.plan ? venta.plan.nombre_plan : 'Pack de ' + venta.cantidad + ' Clases Extra'}
                          {venta.estado === 'aprobada' && venta.clases_restantes !== undefined && (
                            <span className="text-xs text-gray-500 block">Quedan: {venta.clases_restantes}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {venta.comprobante ? (
                            <a 
                              href={'http://localhost:3000' + venta.comprobante} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center"
                            >
                              Ver comprobante
                            </a>
                          ) : (
                            <span className="text-gray-400">Sin comprobante</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (
                            venta.estado === 'aprobada' || venta.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                            venta.estado === 'vencida' ? 'bg-gray-200 text-gray-600' :
                            venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          )}>
                            {venta.estado ? venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1) : 'Desconocido'}
                          </span>
                          {(venta.estado === 'aprobada' || venta.estado === 'completado') && venta.fecha_vencimiento && (
                            <span className="text-xs text-gray-500 block mt-1">
                              Vence: {new Date(venta.fecha_vencimiento).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
