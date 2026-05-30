import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import evaluacionRoutes from "./evaluacion.routes.js";
import inscripcionRoutes from "./Inscripcion.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/evaluaciones", evaluacionRoutes);
router.use("/inscripciones", inscripcionRoutes);

export default router;