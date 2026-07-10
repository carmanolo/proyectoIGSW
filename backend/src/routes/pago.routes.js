import { Router } from "express";
import { solicitarPago, listarPagos, aprobar, rechazar, listarMisPagos } from "../controllers/pago.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/", authMiddleware, authorizeRoles("estudiante"), uploadMiddleware.single("comprobante"), solicitarPago);
router.get("/user", authMiddleware, authorizeRoles("estudiante"), listarMisPagos);
router.get("/", authMiddleware, authorizeRoles("secretario"), listarPagos);
router.patch("/:id/aprobar", authMiddleware, authorizeRoles("secretario"), aprobar);
router.patch("/:id/rechazar", authMiddleware, authorizeRoles("secretario"), rechazar);

export default router;
