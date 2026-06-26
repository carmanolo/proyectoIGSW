import { Router } from "express";
import { registrarVenta, obtenerClasesUsuario, listarVentasUsuario, eliminarVenta, aprobarVenta, rechazarVenta, listarVentas } from "../controllers/venta.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/pack", uploadMiddleware.single("comprobante"), registrarVenta);
router.get("/", authMiddleware, authorizeRoles("secretario"), listarVentas);
router.patch("/:id/aprobar", authMiddleware, authorizeRoles("secretario"), aprobarVenta);
router.patch("/:id/rechazar", authMiddleware, authorizeRoles("secretario"), rechazarVenta);

router.get("/user/:id", obtenerClasesUsuario);
router.get("/user/:id/records", listarVentasUsuario);
router.delete("/:id", authMiddleware, authorizeRoles("secretario"), eliminarVenta);
export default router;