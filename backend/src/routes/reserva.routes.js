import { Router } from "express";
import { createReserva, getReservas } from "../controllers/reserva.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authMiddleware);

// Las reservas las puede hacer la secretaria, o el alumno (depende de la logica de negocio, lo dejamos en secretaria por ahora)
router.post("/", authorizeRoles("secretario"), createReserva);
router.get("/", authorizeRoles("secretario"), getReservas);

export default router;
