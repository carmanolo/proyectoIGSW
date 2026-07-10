import Joi from "joi";

export const incidenciaValidation = Joi.object({
  vehiculo_id: Joi.number().integer().required().messages({
    "number.base": "El ID del vehículo debe ser un número",
    "any.required": "El vehículo es obligatorio",
  }),
  tipo: Joi.string().valid('falla_mecanica', 'choque', 'combustible', 'kilometraje', 'otro').required().messages({
    "string.base": "El tipo de incidencia debe ser un texto",
    "any.only": "El tipo debe ser válido",
    "any.required": "El tipo de incidencia es obligatorio",
  }),
  kilometraje_actual: Joi.number().integer().allow(null, '').messages({
    "number.base": "El kilometraje debe ser un número",
  }),
  descripcion: Joi.string().trim().max(1000).required().messages({
    "string.base": "La descripción debe ser un texto",
    "string.max": "La descripción no puede superar los 1000 caracteres",
    "any.required": "La descripción es obligatoria",
  }),
});
