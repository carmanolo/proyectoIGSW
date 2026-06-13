import { Router } from "express";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getClases, createClase, patchClase, deleteClase, asignarPorLote, getClasesConUsuarios } from "../controllers/clase.controller.js";

const router = Router();

router.use(authMiddleware);
router.get("/asignar", authorizeRoles("secretario"), getClasesConUsuarios);
router.get("/",getClases);
router.post("/crear",authorizeRoles("secretario") ,createClase);
router.post("/asignar",authorizeRoles("secretario"), asignarPorLote)
router.patch("/:id", authorizeRoles("secretario"), patchClase);
router.delete("/:id", authorizeRoles("secretario"), deleteClase);


export default router;

/*"tipo":"practica",
    "descripcion":"Clase inical de manejo",
    "hora_inicio":"16:15",
    "hora_fin":"17:00",
    "dia":"miercoles"*/