import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/authorization.middleware.js";
import { uploadMiddleware } from "../middleware/multer.middleware.js";
import {
  listarArchivosDescargables,
  subirArchivoDescargable,
  eliminarArchivoDescargable,
} from "../controllers/archivo.controller.js";

const router = Router();

router.get("/", authMiddleware, listarArchivosDescargables);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("profesor", "secretario"),
  uploadMiddleware.single("archivo"),
  subirArchivoDescargable
);
router.delete(
  "/:filename",
  authMiddleware,
  authorizeRoles("profesor", "secretario"),
  eliminarArchivoDescargable
);

export default router;
