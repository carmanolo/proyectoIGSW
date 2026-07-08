import { Router } from "express";
import { marcarAsistencia, getAsistenciaPorClase } from "../controllers/asistencia.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authMiddleware);

// Alumnos marcan asistencia escaneando el QR
router.post("/marcar", authorizeRoles("estudiante"), marcarAsistencia);

// Profesores (y secretarios) pueden ver la asistencia de una clase
router.get("/clase/:claseId", authorizeRoles("profesor", "secretario"), getAsistenciaPorClase);

export default router;
