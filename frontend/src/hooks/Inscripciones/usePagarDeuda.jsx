import { useState } from 'react';
import Swal from 'sweetalert2';
import { pagarDeudaService } from '../../services/inscripciones.service.js';

export const usePagarDeuda = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const handlePagarDeuda = async (deuda) => {
    if (!deuda) {
      Swal.fire({
        title: 'Deudas Pendientes',
        text: 'Selecciona una deuda para pagar desde la lista',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    const saldoRestante = parseFloat(deuda.monto_total) - parseFloat(deuda.monto_pagado || 0);

    const { value: montoPago } = await Swal.fire({
      title: 'Pagar Deuda',
      html: `
        <div class="text-left">
          <p><strong>Plan:</strong> ${deuda.plan?.nombre || 'N/A'}</p>
          <p><strong>Monto Total:</strong> $${parseFloat(deuda.monto_total).toLocaleString()}</p>
          <p><strong>Monto Pagado:</strong> $${parseFloat(deuda.monto_pagado || 0).toLocaleString()}</p>
          <p><strong>Saldo Restante:</strong> $${saldoRestante.toLocaleString()}</p>
          <hr class="my-3">
          <label for="monto-pago" class="block text-sm font-medium text-gray-700">Monto a Pagar</label>
          <input id="monto-pago" class="swal2-input" type="number" step="100" 
                 value="${saldoRestante}"
                 min="100" max="${saldoRestante}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '💳 Pagar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const monto = document.getElementById('monto-pago')?.value;
        if (!monto || parseFloat(monto) <= 0) {
          Swal.showValidationMessage('Ingrese un monto válido');
          return false;
        }
        if (parseFloat(monto) > saldoRestante) {
          Swal.showValidationMessage(`El monto no puede exceder el saldo restante ($${saldoRestante.toLocaleString()})`);
          return false;
        }
        return parseFloat(monto);
      }
    });

    if (montoPago) {
      setLoading(true);
      try {
        const response = await pagarDeudaService(deuda.id_inscripcion, montoPago);
        console.log('Pago response:', response);
        
        if (response.success) {
          await Swal.fire({
            title: '¡Pago Realizado!',
            text: response.message || 'El pago se ha procesado exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        } else {
          throw new Error(response.message || 'Error al procesar el pago');
        }
      } catch (error) {
        console.error('Error en handlePagarDeuda:', error);
        await Swal.fire({
          title: 'Error al Pagar',
          text: error.message || 'Ocurrió un error al procesar el pago',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return { handlePagarDeuda, loading };
};

export default usePagarDeuda;