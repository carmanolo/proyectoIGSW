import { useState, useCallback } from 'react';
import { getUsersClase } from '../../services/clase.service.js';
import { fireDynamicSwal } from '../utils/dynamicSwal.jsx';
import Swal from 'sweetalert2';


export function useClasesConUsuarios() {
  const [loading, setLoading]= useState(false);

  const fetchClasesConUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsersClase();
      if(!data || data.length === 0){
        await fireDynamicSwal(404, 'Sin resultados', 'No hay clases teóricas con usuarios asignados');
        return
      }

      const html = data.map((clase) => {
        const usuarios = clase.usuario_asignados?.length > 0
          ? clase.usuario_asignados.map((u) => `
              <li class="text-sm">${u.nombre} <span class="text-gray-400">(${u.email})</span></li>
            `).join('')
          : '<li class="text-sm text-gray-400">Sin usuarios asignados</li>';
 
        return `
          <div class="mb-4 text-left">
            <p class="font-semibold">${clase.descripcion} 
              <span class="badge badge-primary ml-1">${String(clase.tipo).toUpperCase()}</span>
            </p>
            <p class="text-xs text-gray-500">${String(clase.dia).toUpperCase()} · ${clase.hora_inicio} - ${clase.hora_fin}</p>
            <ul class="mt-1 ml-2 list-disc list-inside">
              ${usuarios}
            </ul>
          </div>
        `;
      }).join('<hr class="my-2"/>');
 
      await Swal.fire({
        title: 'Usuarios asignados por clase',
        html: `<div class="max-h-80 overflow-y-auto text-left">${html}</div>`,
        confirmButtonText: 'Cerrar',
        theme: 'light',
      });
    } catch (error) {
        console.error(error);
        response = error?.response || {status: 500, message: "Error desconocido"};
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchClasesConUsuarios,
  };
}