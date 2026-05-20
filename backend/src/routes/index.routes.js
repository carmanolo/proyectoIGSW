import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import claseRoutes from "./clase.routes.js";
import userRoutes from "./user.routes.js";


const router = new Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/clases", claseRoutes);
router.use("/users", userRoutes)


export default router;