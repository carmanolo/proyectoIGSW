import { Router } from "express";
import { registrarVenta, obtenerClasesUsuario, listarVentasUsuario, eliminarVenta } from "../controllers/venta.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/pack", registrarVenta);

router.get("/user/:id", obtenerClasesUsuario);
router.get("/user/:id/records", listarVentasUsuario);
router.delete("/:id", authMiddleware, authorizeRoles("secretario"), eliminarVenta);
export default router;