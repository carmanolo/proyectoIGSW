import { Router } from "express";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { getVehiculo, asignarVehiculo, patchVehiculo, deleteVehiculo } from "../controllers/vehiculo.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/",getVehiculo);
router.post("/crear",authorizeRoles("secretario") ,asignarVehiculo);
router.patch("/:id", authorizeRoles("secretario"), patchVehiculo);
router.delete("/:id", authorizeRoles("secretario"), deleteVehiculo);

export default router;