import { Router } from "express";
import { crearDeuda,obtenerDeudas,eliminarDeuda,cambiarEstado,pagarDeuda } from "../controllers/deuda.controller.js";

const router = Router();


router.post("/crear", crearDeuda);
router.get("/obtener", obtenerDeudas);
router.delete("/eliminar/:id", eliminarDeuda);
router.patch("/cambiar/:id/estado", cambiarEstado);


router.post("/deudas/:id/pagar", pagarDeuda);


export default router;