import { Router } from "express";
import { getDashboardEstudiante, getProximaClase } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/estudiante", getDashboardEstudiante);
router.get("/proxima-clase", getProximaClase);

export default router;