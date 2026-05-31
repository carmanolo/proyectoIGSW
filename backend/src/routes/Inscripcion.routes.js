import { Router } from "express";
import {
  contratarPlan,
  pagarDeuda,
  obtenerDeudasPendientes,
  obtenerInscripcionesPorAlumno,
  obtenerInscripcionPorId,
  cancelarInscripcion,
} from "../controllers/Inscripcion.controller.js";

const router = Router();

router.post("/contratar", contratarPlan);
router.post("/:id/pagar", pagarDeuda);
router.get("/alumno/:alumnoId/deudas", obtenerDeudasPendientes);
router.get("/alumno/:alumnoId", obtenerInscripcionesPorAlumno);
router.get("/:id", obtenerInscripcionPorId);
router.put("/:id/cancelar", cancelarInscripcion);

export default router;