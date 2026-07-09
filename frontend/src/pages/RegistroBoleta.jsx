import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, FileText, Upload, CreditCard, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Building, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { solicitarRegistroConBoleta, getSedesService, validarRut, formatearRut, formatearRutBackend } from '../services/registro.service.js';
import { getPlanesService } from '../services/plan.service.js';

export const RegistroBoleta = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [boletaFile, setBoletaFile] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    sede: '',
    plan_id: '',
    metodo_pago: 'transferencia',
    banco_origen: '',
    banco_destino: 'Banco Estado',
    numero_cuenta_origen: '',
    rut_titular: '',
    nombre_titular: '',
  });

  const [errors, setErrors] = useState({});

  // Cargar planes y sedes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar planes
        const planesResponse = await getPlanesService();
        const planesData = planesResponse?.data?.data || [];
        setPlanes(planesData);

        // Cargar sedes
        const sedesResponse = await getSedesService();
        const sedesData = sedesResponse?.data || sedesResponse?.data?.data || [
          'Sede Concepción',
          'Sede Chillán',
          'Sede Los Ángeles',
          'Sede Talcahuano'
        ];
        setSedes(sedesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        // Datos de ejemplo en caso de error
        setPlanes([
          { id_plan: 1, nombre: 'Básico', costo: 25000, duracion_semanas: 4, clases_totales: 8 },
          { id_plan: 2, nombre: 'Intermedio', costo: 35000, duracion_semanas: 6, clases_totales: 12 },
          { id_plan: 3, nombre: 'Avanzado', costo: 45000, duracion_semanas: 8, clases_totales: 16 },
        ]);
        setSedes([
          'Sede Concepción',
          'Sede Chillán',
          'Sede Los Ángeles',
          'Sede Talcahuano'
        ]);
      }
    };
    loadData();
  }, []);

  // Manejar cambio de input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'rut') {
      // Solo permitir números, K y guión
      const rutLimpio = value.replace(/[^0-9kK-]/g, '');
      setFormData(prev => ({ ...prev, [name]: rutLimpio }));
      
      // Validar RUT en tiempo real
      if (rutLimpio.length >= 8) {
        const esValido = validarRut(rutLimpio);
        if (!esValido) {
          setErrors(prev => ({ ...prev, rut: 'RUT inválido' }));
        } else {
          setErrors(prev => ({ ...prev, rut: '' }));
          // Formatear RUT
          const rutFormateado = formatearRut(rutLimpio);
          setFormData(prev => ({ ...prev, rut: rutFormateado }));
        }
      } else {
        setErrors(prev => ({ ...prev, rut: '' }));
      }
      return;
    }

    //  Validar contraseña en tiempo real
    if (name === 'password') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value && value.length < 8) {
        setErrors(prev => ({ ...prev, password: 'La contraseña debe tener al menos 8 caracteres' }));
      } else if (value && value.length > 0) {
        setErrors(prev => ({ ...prev, password: '' }));
        // Validar que coincida con confirmPassword
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
        } else if (formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
      return;
    }

    if (name === 'confirmPassword') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else if (value) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar subida de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        Swal.fire({
          title: 'Error',
          text: 'Solo se permiten archivos PDF',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        e.target.value = '';
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Error',
          text: 'El archivo no puede superar los 5MB',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        e.target.value = '';
        return;
      }

      setBoletaFile(file);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es obligatorio';
    if (formData.rut.trim() && !validarRut(formData.rut.replace(/\./g, ''))) {
      newErrors.rut = 'RUT inválido';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!formData.sede) newErrors.sede = 'La sede es obligatoria';
    if (!formData.plan_id) newErrors.plan_id = 'Debes seleccionar un plan';
    if (!boletaFile) newErrors.boleta = 'Debes subir la boleta de pago';
    if (!termsAccepted) newErrors.terms = 'Debes aceptar los términos y condiciones';

    if (formData.metodo_pago === 'transferencia') {
      if (!formData.banco_origen) newErrors.banco_origen = 'Banco de origen obligatorio';
      if (!formData.numero_cuenta_origen) newErrors.numero_cuenta_origen = 'Número de cuenta obligatorio';
      if (!formData.rut_titular) newErrors.rut_titular = 'RUT del titular obligatorio';
      if (!formData.nombre_titular) newErrors.nombre_titular = 'Nombre del titular obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log(' Errores de validación:', errors);
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      const rutLimpio = formData.rut.replace(/\./g, '');
      
      if (!/^[0-9]{1,8}-[0-9kK]{1}$/.test(rutLimpio)) {
        console.error(' RUT inválido:', rutLimpio);
        Swal.fire({
          title: 'Error',
          text: 'El RUT debe tener formato válido (ej: 12345678-9)',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }
      
      const telefonoLimpio = formData.telefono.replace(/\s/g, '');
      if (!/^[0-9]{9,15}$/.test(telefonoLimpio)) {
        console.error(' Teléfono inválido:', telefonoLimpio);
        Swal.fire({
          title: 'Error',
          text: 'El teléfono debe tener entre 9 y 15 dígitos',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
        return;
      }
      
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('rut', rutLimpio);
      formDataToSend.append('telefono', telefonoLimpio);
      formDataToSend.append('sede', formData.sede);
      formDataToSend.append('plan_id', formData.plan_id);
      formDataToSend.append('metodo_pago', formData.metodo_pago);
      formDataToSend.append('password', formData.password);
      if (formData.email) formDataToSend.append('email', formData.email);
      if (formData.metodo_pago === 'transferencia') {
        formDataToSend.append('banco_origen', formData.banco_origen);
        formDataToSend.append('banco_destino', formData.banco_destino);
        formDataToSend.append('numero_cuenta_origen', formData.numero_cuenta_origen);
        formDataToSend.append('rut_titular', formData.rut_titular);
        formDataToSend.append('nombre_titular', formData.nombre_titular);
      }
      
      // Agregar archivo de boleta
      formDataToSend.append('boleta', boletaFile);

      const response = await solicitarRegistroConBoleta(formDataToSend);
      console.log(' Respuesta del servidor:', response);

      await Swal.fire({
        title: '¡Registro Exitoso!',
        html: `
          <div class="text-left">
            <p class="text-green-600 font-medium">${response.message || 'Tu solicitud ha sido enviada.'}</p>
            <p class="text-gray-600 mt-2">Quedarás en lista de espera para verificación de secretaría.</p>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p class="text-sm text-yellow-800">
                 Tiempo estimado de verificación: 24-48 horas hábiles
              </p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p class="text-sm text-blue-800">
                 Puedes iniciar sesión con tu correo y la contraseña que elegiste después de la verificación.
              </p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Ir al Login'
      });

      navigate('/auth');

    } catch (error) {
      console.error(' Error al registrar:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar tu solicitud',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const planSeleccionado = planes.find(p => p.id_plan === parseInt(formData.plan_id));

  return (
    <div className="min-h-screen bg-gradient-custom py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </button>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">
            📝 Inscripción de Plan
          </h1>
          <p className="text-gray-600 mt-2">
            Completa el formulario para inscribirte en un plan de conducción
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              {errors.nombre && (
                <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* RUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.rut ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 12.345.678-9"
                  maxLength="12"
                />
              </div>
              {errors.rut && (
                <p className="text-sm text-red-500 mt-1">{errors.rut}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 9 1234 5678"
                />
              </div>
              {errors.telefono && (
                <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
              )}
            </div>

            {/* Email  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Sede */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sede <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="sede"
                  value={formData.sede}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white ${
                    errors.sede ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una sede</option>
                  {sedes.map(sede => (
                    <option key={sede} value={sede}>{sede}</option>
                  ))}
                </select>
              </div>
              {errors.sede && (
                <p className="text-sm text-red-500 mt-1">{errors.sede}</p>
              )}
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="plan_id"
                  value={formData.plan_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white ${
                    errors.plan_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona un plan</option>
                  {planes.map(plan => (
                    <option key={plan.id_plan} value={plan.id_plan}>
                      {plan.nombre} - ${plan.costo.toLocaleString()} ({plan.duracion_semanas} semanas)
                    </option>
                  ))}
                </select>
              </div>
              {errors.plan_id && (
                <p className="text-sm text-red-500 mt-1">{errors.plan_id}</p>
              )}
            </div>
          </div>

          {/* Resumen del plan seleccionado */}
          {planSeleccionado && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Plan Seleccionado
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nombre:</span>
                  <p className="font-medium text-gray-800">{planSeleccionado.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-500">Costo:</span>
                  <p className="font-medium text-gray-800">${planSeleccionado.costo.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Duración:</span>
                  <p className="font-medium text-gray-800">{planSeleccionado.duracion_semanas} semanas</p>
                </div>
                <div>
                  <span className="text-gray-500">Clases:</span>
                  <p className="font-medium text-gray-800">{planSeleccionado.clases_totales || 10} clases</p>
                </div>
              </div>
            </div>
          )}

          {/* Método de Pago */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="metodo_pago"
                value={formData.metodo_pago}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none bg-white"
              >
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="webpay">WebPay</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="efectivo">Efectivo (en oficina)</option>
              </select>
            </div>
          </div>

          {/* Datos de Transferencia (si es transferencia) */}
          {formData.metodo_pago === 'transferencia' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Datos de Transferencia
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco Origen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="banco_origen"
                    value={formData.banco_origen}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.banco_origen ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Banco de Chile"
                  />
                  {errors.banco_origen && (
                    <p className="text-sm text-red-500 mt-1">{errors.banco_origen}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco Destino
                  </label>
                  <input
                    type="text"
                    name="banco_destino"
                    value={formData.banco_destino}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50"
                    placeholder="Banco Estado"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta Origen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="numero_cuenta_origen"
                    value={formData.numero_cuenta_origen}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.numero_cuenta_origen ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Número de cuenta"
                  />
                  {errors.numero_cuenta_origen && (
                    <p className="text-sm text-red-500 mt-1">{errors.numero_cuenta_origen}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT del Titular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rut_titular"
                    value={formData.rut_titular}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.rut_titular ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: 12.345.678-9"
                  />
                  {errors.rut_titular && (
                    <p className="text-sm text-red-500 mt-1">{errors.rut_titular}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Titular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre_titular"
                    value={formData.nombre_titular}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.nombre_titular ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo del titular"
                  />
                  {errors.nombre_titular && (
                    <p className="text-sm text-red-500 mt-1">{errors.nombre_titular}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subir Boleta */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Boleta de Pago <span className="text-red-500">*</span>
            </label>
            <div className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-all
              ${errors.boleta ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'}
            `}>
              <input
                type="file"
                id="boleta"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="boleta" className="cursor-pointer block">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">
                  {boletaFile ? boletaFile.name : '📄 Haz clic para subir la boleta (PDF)'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Formatos permitidos: PDF (máx. 5MB)
                </p>
                {boletaFile && (
                  <p className="text-sm text-green-600 mt-2">
                     Archivo seleccionado: {boletaFile.name}
                  </p>
                )}
              </label>
            </div>
            {errors.boleta && (
              <p className="text-sm text-red-500 mt-1">{errors.boleta}</p>
            )}
          </div>

          {/* Términos y condiciones */}
          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                }}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                Acepto los{' '}
                <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a>
                {' '}y autorizo el tratamiento de mis datos personales según la ley N° 19.628.
                {errors.terms && (
                  <span className="block text-red-500 text-xs mt-1">{errors.terms}</span>
                )}
              </span>
            </label>
          </div>

          {/* Botón Enviar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-yellow-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            ⏳ Al enviar esta solicitud, aceptas quedar en lista de espera para verificación de secretaría
          </p>
        </form>

        {/* Información adicional */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl mb-2">📋</div>
            <h4 className="font-semibold text-gray-800">Paso 1</h4>
            <p className="text-sm text-gray-600">Completa tus datos personales</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl mb-2">💳</div>
            <h4 className="font-semibold text-gray-800">Paso 2</h4>
            <p className="text-sm text-gray-600">Selecciona tu plan y método de pago</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl mb-2">📄</div>
            <h4 className="font-semibold text-gray-800">Paso 3</h4>
            <p className="text-sm text-gray-600">Sube tu boleta de pago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroBoleta;