import { Router } from "express";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getEvaluacion, crearEvaluacion, patchEvaluacion, deleteEvaluacion } from "../controllers/evaluacion.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/",getEvaluacion);
router.post("/crear",authorizeRoles("secretario") ,crearEvaluacion);
router.patch("/:id", authorizeRoles("secretario"), patchEvaluacion);
router.delete("/:id", authorizeRoles("secretario"), deleteEvaluacion);

export default router;