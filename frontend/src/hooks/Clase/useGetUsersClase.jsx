import { useState, useCallback } from 'react';
import { getUsersClase, editAssignsClase, assignsClaseService } from '../../services/clase.service.js';
import { fireDynamicSwal } from '../utils/dynamicSwal.jsx';
import Swal from 'sweetalert2';


export function useClasesConUsuarios() {
  const [loading, setLoading]= useState(false);

  const fetchClasesConUsuarios = useCallback(async () => {
    let response = null;
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
              <li class="text-sm flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm usuario-check"
                  data-id-clase="${clase.id_clase}"
                  data-id-usuario="${u.id}"
                  checked
                />
                <span>${u.nombre} <span class="text-gray-400">(${u.email})</span></span>
              </li>
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
 
      const result = await Swal.fire({
        title: 'Usuarios asignados por clase',
        html: `<div class="max-h-80 overflow-y-auto text-left">${html}</div>
              <p class="text-xs text-gray-400 mt-2">Desmarca los usuarios que quieras excluir y presiona "Actualizar asignaciones"</p>`,
        showCancelButton: true,
        confirmButtonText: 'Actualizar asignaciones',
        cancelButtonText: 'Cerrar',
        theme: 'light',

        didOpen: () => {
          const actions = document.querySelector('.swal2-actions');
          if (actions && !document.getElementById('btn-asignar-lote')) {
            const btn = document.createElement('button');
            btn.id = 'btn-asignar-lote';
            btn.textContent = 'Asignar por lote';
            btn.className = 'swal2-confirm swal2-styled';
            btn.style.backgroundColor = '#dc2626'; 
            btn.addEventListener('click', async () => {
              Swal.close();
              try {
                const res = await assignsClaseService({});
                await fireDynamicSwal(res?.status, null, res?.message);
              } catch (err) {
                const status  = err?.status  || 500;
                const mensaje = err?.data?.message || err?.message || 'Error al asignar por lote';
                await fireDynamicSwal(status, 'Error', mensaje);
              }
            });
            // Insertar antes del botón "Cerrar"
            const cancelBtn = document.querySelector('.swal2-cancel');
            actions.insertBefore(btn, cancelBtn);
          }
        },

        preConfirm: () => {
          //agrupar los ids que se desmarquen
          const exclusionesPorClase = {}
          document.querySelectorAll('.usuario-check').forEach((checkbox)=>{
            if(!checkbox.checked){
              const idClase = checkbox.getAttribute('data-id-clase');
              const idUsuario = Number(checkbox.getAttribute('data-id-usuario'));
              if(!exclusionesPorClase[idClase]){
                exclusionesPorClase[idClase] = []
              }
              exclusionesPorClase[idClase].push(idUsuario);
            }
          });
          return exclusionesPorClase;
        },
      });

      if(!result.isConfirmed) return;

      const exclusionesPorClase = result.value;
      const idsClasesConExclusion = Object.keys(exclusionesPorClase);

      if(idsClasesConExclusion.length ===0){
        await fireDynamicSwal(200, null, 'No se realuzaron exclusiones');
        return;
      }

      for (const idClase of idsClasesConExclusion) {
        await editAssignsClase(idClase, exclusionesPorClase[idClase]);
      }

      await fireDynamicSwal(200, null, 'Asignaciones actualizadas exitosamente');
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
