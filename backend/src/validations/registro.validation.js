"use strict";
import Joi from "joi";
import { SEDES_VALIDAS } from "../constants/user.constants.js";

export const registroEsperaValidation = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede tener más de 100 caracteres",
  }),
  
  rut: Joi.string().pattern(/^[0-9]{1,8}-[0-9kK]{1}$/).required().messages({
    "string.empty": "El RUT es obligatorio",
    "string.pattern.base": "El RUT debe tener formato válido (ej: 12345678-9)",
  }),
  
  telefono: Joi.string().pattern(/^[0-9]{9,15}$/).required().messages({
    "string.empty": "El teléfono es obligatorio",
    "string.pattern.base": "El teléfono debe tener entre 9 y 15 dígitos",
  }),
  
  sede: Joi.string().valid(...SEDES_VALIDAS).required().messages({
    "string.empty": "La sede es obligatoria",
    "any.only": "La sede seleccionada no es válida",
  }),
  
  plan_id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del plan debe ser un número",
    "number.positive": "El ID del plan debe ser positivo",
    "any.required": "El ID del plan es obligatorio",
  }),
  
  metodo_pago: Joi.string().valid('transferencia', 'efectivo', 'tarjeta', 'webpay').optional(),
  banco_origen: Joi.string().optional().allow('', null),
  banco_destino: Joi.string().optional().allow('', null),
  numero_cuenta_origen: Joi.string().optional().allow('', null),
  rut_titular: Joi.string().optional().allow('', null),
  nombre_titular: Joi.string().optional().allow('', null),
  
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
}).unknown(false);

export const verificacionRegistroValidation = Joi.object({
  estado: Joi.string().valid("verificada", "rechazada").required().messages({
    "any.only": "El estado debe ser 'verificada' o 'rechazada'",
    "any.required": "El estado es obligatorio",
  }),
  observaciones: Joi.string().max(500).optional().allow('', null),
}).unknown(false);