import { Router } from "express";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getEvaluacion, createEvaluacion, patchEvaluacion, deleteEvaluacion } from "../controllers/evaluacion.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/",getEvaluacion);
router.post("/crear",authorizeRoles("profesor"), createEvaluacion);
router.patch("/:id", authorizeRoles("profesor"), patchEvaluacion);
router.delete("/:id", authorizeRoles("profesor"), deleteEvaluacion);

export default router;