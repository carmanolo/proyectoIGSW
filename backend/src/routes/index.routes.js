import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import horarioRoutes from "./horario.routes.js";
import deudasRoutes from "./deudas.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/horarios", horarioRoutes);
router.use("/deudas", deudasRoutes);

export default router;