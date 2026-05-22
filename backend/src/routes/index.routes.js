import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import claseRoutes from "./clase.routes.js";
import userRoutes from "./user.routes.js";

import horarioRoutes from "./horario.routes.js";
import deudasRoutes from "./deudas.routes.js";
import planRoutes from "./Plan.routes.js";
import inscripcionRoutes from "./Inscripcion.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/clases", claseRoutes);
router.use("/users", userRoutes)

router.use("/horarios", horarioRoutes);
router.use("/deudas", deudasRoutes);
router.use("/planes", planRoutes);
router.use("/inscripciones", inscripcionRoutes);

export default router;