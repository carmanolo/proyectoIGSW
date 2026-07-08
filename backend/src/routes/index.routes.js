import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import claseRoutes from "./clase.routes.js";
import userRoutes from "./user.routes.js";
import planRoutes from "./Plan.routes.js";
import evaluacionRoutes from "./evaluacion.routes.js";
import inscripcionRoutes from "./Inscripcion.routes.js";
import ventaRoutes from "./venta.routes.js";
import reservaRoutes from "./reserva.routes.js";
import vehiculoRoutes from "./vehiculo.routes.js";
import registroEsperaRoutes from "./registroEspera.routes.js";
import asistenciaRoutes from "./asistencia.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/evaluaciones", evaluacionRoutes);
router.use("/inscripciones", inscripcionRoutes);
router.use("/clases", claseRoutes);
router.use("/usuarios", userRoutes);
router.use("/planes", planRoutes);
router.use("/users", userRoutes)
router.use("/ventas", ventaRoutes);
router.use("/reservas", reservaRoutes);
router.use("/vehiculos", vehiculoRoutes);
router.use("/asistencias", asistenciaRoutes);
router.use("/registro-espera", registroEsperaRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;