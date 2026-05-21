import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser, createUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/",getUsers);
router.get("/:id", getUserById);
router.post("/crear" ,createUser);
router.patch("/:id", authorizeRoles("secretario"), updateUser);
router.delete("/:id", authorizeRoles("secretario"), deleteUser);

export default router;