import { Router } from "express";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getHorarios, asignarHorario, patchHorario, deleteHorario } from "../controllers/horario.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/",getHorarios);
router.post("/crear",authorizeRoles("secretario") ,asignarHorario);
router.patch("/:id", authorizeRoles("secretario"), patchHorario);
router.delete("/:id", authorizeRoles("secretario"), deleteHorario);

export default router;