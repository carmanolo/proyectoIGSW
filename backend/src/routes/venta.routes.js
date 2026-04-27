import { Router } from "express";
import { registrarVenta } from "../controllers/venta.controller.js";

const router = Router();


router.post("/pack", registrarVenta); 

export default router;