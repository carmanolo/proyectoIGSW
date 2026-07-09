import { Router } from "express";
import { getDashboardEstudiante, getProximaClase, getMisAlumnos, getMisClases } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/estudiante", getDashboardEstudiante);
router.get("/proxima-clase", getProximaClase);
router.get("/mis-alumnos", getMisAlumnos);
router.get("/mis-clases", getMisClases);
export default router;