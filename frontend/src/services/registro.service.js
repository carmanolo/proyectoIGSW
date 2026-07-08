import axios from './root.service.js';

export async function solicitarRegistroConBoleta(data) {
  try {
    const response = await axios.post('/registro/solicitar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getSedesService() {
  try {
    const response = await axios.get('/registro/sedes');
    return response.data;
  } catch (error) {
    return {
      success: true,
      data: [
        'Sede Concepción',
        'Sede Nonguen',
        'Sede San Pedro de la Paz',
        'Sede Chiguayante',
      ]
    };
  }
}

export function validarRut(rut) {
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) {
    return false;
  }
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  let suma = 0;
  let multiplo = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  
  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = '';
  
  if (dvEsperado === 11) {
    dvCalculado = '0';
  } else if (dvEsperado === 10) {
    dvCalculado = 'K';
  } else {
    dvCalculado = dvEsperado.toString();
  }
  
  return dv === dvCalculado;
}

export function formatearRut(rut) {
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
  if (rutLimpio.length < 2) return rut;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  
  let resultado = '';
  let contador = 0;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    resultado = cuerpo[i] + resultado;
    contador++;
    if (contador === 3 && i > 0) {
      resultado = '.' + resultado;
      contador = 0;
    }
  }
  
  return resultado + '-' + dv;
}


export function formatearRutBackend(rut) {
  return rut.replace(/\./g, '').replace(/-/g, '');
}