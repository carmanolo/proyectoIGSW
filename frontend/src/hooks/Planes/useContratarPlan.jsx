import Swal from "sweetalert2";
import { contratarPlanService } from "../../services/inscripciones.service.js";
import { getPlanesService } from "../../services/plan.service.js";

export const useContratarPlan = (alumno_id, fetchDeudas) => {
  const handleContratarPlan = async () => {
    try {

      let planes = [];
      try {
        const planesResponse = await getPlanesService();
        console.log('Planes response:', planesResponse);
        planes = planesResponse.data?.data || [];
      } catch (error) {
        console.error('Error al obtener planes:', error);
        await Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los planes disponibles",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      if (planes.length === 0) {
        await Swal.fire({
          title: "Sin planes disponibles",
          text: "No hay planes activos para contratar",
          icon: "info",
          confirmButtonText: "OK",
        });
        return;
      }
      const planesOptions = planes.map(plan => 
        `<option value="${plan.id_plan}">${plan.nombre} - $${plan.costo} (${plan.duracion_semanas} semanas)</option>`
      ).join('');

      const today = new Date().toISOString().split('T')[0];
      const { value: formValues } = await Swal.fire({
        title: "Contratar Plan",
        html: `
          <div class="swal2-field m-1">
            <label for="plan-select" class="swal2-label">Selecciona un Plan</label>
            <select id="plan-select" class="swal2-select" required>
              <option value="">-- Seleccione --</option>
              ${planesOptions}
            </select>
          </div>
          <div class="swal2-field m-1">
            <label for="fecha-inicio" class="swal2-label">Fecha de Inicio</label>
            <input id="fecha-inicio" class="swal2-input" type="date" value="${today}" min="${today}" required>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Contratar",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const plan_id = document.getElementById("plan-select")?.value;
          const fecha_inicio = document.getElementById("fecha-inicio")?.value;

          if (!plan_id) {
            Swal.showValidationMessage("Seleccione un plan");
            return false;
          }
          if (!fecha_inicio) {
            Swal.showValidationMessage("Seleccione una fecha de inicio");
            return false;
          }

          return { plan_id: parseInt(plan_id), fecha_inicio };
        },
      });

      if (!formValues) return;
      const response = await contratarPlanService({
        alumno_id,
        plan_id: formValues.plan_id,
        fecha_inicio: formValues.fecha_inicio,
      });

      console.log('Contratación response:', response);

      if (response.success) {
        await Swal.fire({
          title: "¡Plan Contratado!",
          text: response.message || "El plan se ha contratado exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        });
        
        if (typeof fetchDeudas === "function") {
          fetchDeudas();
        }
      } else {
        throw new Error(response.message || "Error al contratar el plan");
      }
    } catch (error) {
      console.error("Error en handleContratarPlan:", error);
      await Swal.fire({
        title: "Error",
        text: error.message || "Error al contratar el plan",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return { handleContratarPlan };
};

export default useContratarPlan;