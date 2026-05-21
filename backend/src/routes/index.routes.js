import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import horarioRoutes from "./horario.routes.js";
import ventaRoutes from "./venta.routes.js";
import vehiculoRoutes from "./vehiculo.routes.js";
import reservaRoutes from "./reserva.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/horarios", horarioRoutes);
router.use("/ventas", ventaRoutes);
router.use("/vehiculos", vehiculoRoutes);
router.use("/reservas", reservaRoutes);

export default router;