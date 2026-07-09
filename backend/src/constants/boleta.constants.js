export const METODOS_PAGO = {
  TRANSFERENCIA: 'transferencia',
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  WEBPAY: 'webpay'
};

export const ESTADO_BOLETA = {
  PENDIENTE: 'pendiente',
  VERIFICADA: 'verificada',
  RECHAZADA: 'rechazada'
};

export const FORMATOS_BOLETA = ['pdf', 'jpg', 'jpeg', 'png'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB