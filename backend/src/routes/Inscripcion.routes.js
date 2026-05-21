import express from "express";
import {
  contratarPlan,
  pagarDeuda,
  obtenerDeudasPendientes,
  obtenerTodasLasDeudas,
  obtenerHistorialPagos,
  obtenerPagosPorInscripcion,
  obtenerResumenFinanciero,
  cancelarInscripcion,
} from "../controllers/Inscripcion.controller.js";

const router = express.Router();

router.post("/contratar", contratarPlan);

router.post("/:id/pagar", pagarDeuda);


router.get("/alumno/:alumnoId/deudas/pendientes", obtenerDeudasPendientes);
router.get("/alumno/:alumnoId/deudas/todas", obtenerTodasLasDeudas);


router.get("/alumno/:alumnoId/pagos", obtenerHistorialPagos);
router.get("/inscripcion/:inscripcionId/pagos", obtenerPagosPorInscripcion);
router.get("/alumno/:alumnoId/resumen", obtenerResumenFinanciero);

router.patch("/:id/cancelar", cancelarInscripcion);

export default router;