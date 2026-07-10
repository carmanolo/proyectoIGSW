import express from "express";
import { createIncidencia, getIncidencias, patchIncidenciaStatus } from "../controllers/incidencia.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", authorizeRoles("profesor"), createIncidencia);
router.get("/", getIncidencias); // handled roles inside controller
router.patch("/:id/estado", authorizeRoles("secretario"), patchIncidenciaStatus);

export default router;
