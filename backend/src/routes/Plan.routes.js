import { Router } from "express";
import {
  crearPlan,
  obtenerTodosLosPlanes,
  obtenerPlanPorId,
  actualizarPlan,
  eliminarPlan,
  cambiarEstadoPlan,
  obtenerPlanesActivos,
  obtenerPlanesPorTipo,
} from "../controllers/plan.controller.js";

const router = Router();

router.get("/activos", obtenerPlanesActivos);
router.get("/tipo/:tipo", obtenerPlanesPorTipo);
router.get("/", obtenerTodosLosPlanes);      
router.get("/:id", obtenerPlanPorId);        
router.post("/", crearPlan);                 
router.put("/:id", actualizarPlan);          
router.delete("/:id", eliminarPlan);         
router.patch("/:id/estado", cambiarEstadoPlan);

export default router;