import { Router } from "express";
import {
  solicitarRegistroConBoleta,
  obtenerListaEspera,
  verificarRegistro
} from "../controllers/registroEspera.controller.js";
import {
  uploadBoleta,
  validarBoletaPDF,
  handleMulterError
} from "../middleware/fileValidation.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

// Ruta pública - Registrar con boleta
router.post("/solicitar",uploadBoleta.single('boleta'),validarBoletaPDF,handleMulterError,solicitarRegistroConBoleta);
// Rutas protegidas - Solo secretaría
router.use(authMiddleware);
router.get(
  "/lista-espera",
  authorizeRoles("secretaria", "ADMINISTRADOR"),
  obtenerListaEspera
);

router.patch(
  "/verificar/:id",
  authorizeRoles("secretaria", "ADMINISTRADOR"),
  verificarRegistro
);

export default router;