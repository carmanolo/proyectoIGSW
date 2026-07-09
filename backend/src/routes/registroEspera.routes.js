import { Router } from "express";
import { solicitarRegistroConBoleta, obtenerListaEspera, verificarRegistro, obtenerDetalleSolicitud, contarSolicitudesPendientes } from "../controllers/registroEspera.controller.js";
import { uploadBoleta, validarBoletaPDF, handleMulterError } from "../middleware/fileValidation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.post("/solicitar", uploadBoleta.single('boleta'), validarBoletaPDF, handleMulterError, solicitarRegistroConBoleta);
router.use(authMiddleware);
router.get("/lista-espera", authorizeRoles("secretario", "secretaria", "ADMINISTRADOR"), obtenerListaEspera);
router.get("/solicitud/:id", authorizeRoles("secretario", "secretaria", "ADMINISTRADOR"), obtenerDetalleSolicitud);
router.patch("/verificar/:id", authorizeRoles("secretario", "secretaria", "ADMINISTRADOR"), verificarRegistro);
router.get("/pendientes/count", authorizeRoles("secretario", "secretaria", "ADMINISTRADOR"), contarSolicitudesPendientes);

export default router;