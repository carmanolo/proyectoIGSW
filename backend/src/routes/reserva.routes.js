import { Router } from "express";
import { createReserva, getReservas, getReservasUsuario, updateReservaEstado } from "../controllers/reserva.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authMiddleware);

// Las reservas las puede hacer la secretaria, o el alumno
router.post("/", authorizeRoles("secretario", "alumnos"), createReserva);
router.get("/", authorizeRoles("secretario"), getReservas);

// Nuevas rutas
router.get("/ocupacion", authorizeRoles("alumnos", "secretario", "profesor"), async (req, res) => {
    const { getOcupacionVehiculos } = await import("../controllers/reserva.controller.js");
    return getOcupacionVehiculos(req, res);
});
router.get("/user/:id", authorizeRoles("alumnos", "secretario", "profesor"), getReservasUsuario);
router.patch("/:id/estado", authorizeRoles("secretario"), updateReservaEstado);

export default router;
