import { Router } from "express";
import { createVehiculo, getVehiculos, deleteVehiculo } from "../controllers/vehiculo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", authorizeRoles("secretario"), createVehiculo);
router.get("/", authorizeRoles("secretario"), getVehiculos);
router.delete("/:id", authorizeRoles("secretario"), deleteVehiculo);

export default router;
