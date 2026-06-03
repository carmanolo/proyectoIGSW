"use strict";
import Joi from "joi";
import {
  RESULTADOS_EVALUACION,
  RESULTADO_MANEJO,
  ALUMNO_OBLIGATORIO,
  COMENTARIO_OBLIGATORIO,
  CALIFICACION_TEORICA_INVALIDA,
  CAMPOS_ADICIONALES,
} from "../constants/evaluacion.costants.js";

const resultadoManejoNumber = Joi.number().integer().valid(...RESULTADO_MANEJO).allow(null).messages({
  "number.base": "El resultado de manejo debe ser 0, 1 o 2",
  "number.integer": "El resultado de manejo debe ser un número entero",
  "any.only": `El resultado de manejo debe ser uno de: ${RESULTADO_MANEJO.join(", ")}`,
});

export const integrityValidation = Joi.object({
  alumno: Joi.string().trim().max(255).messages({
    "string.base": "El alumno debe ser un texto",
    "string.max": "El alumno no puede superar los 255 caracteres",
  }),
  calificacion_teorica: Joi.number().integer().min(0).max(38).allow(null).messages({
    "number.base": CALIFICACION_TEORICA_INVALIDA,
    "number.integer": CALIFICACION_TEORICA_INVALIDA,
    "number.min": CALIFICACION_TEORICA_INVALIDA,
    "number.max": CALIFICACION_TEORICA_INVALIDA,
  }),
  resultado_manejo_1: resultadoManejoNumber,
  resultado_manejo_2: resultadoManejoNumber,
  resultado_manejo_3: resultadoManejoNumber,
  resultado_manejo_4: resultadoManejoNumber,
  resultado_manejo_5: resultadoManejoNumber,
  Resultado: Joi.string().trim().valid(...RESULTADOS_EVALUACION).insensitive().messages({
    "string.base": "El resultado debe ser un texto",
    "any.only": `El resultado debe ser uno de: ${RESULTADOS_EVALUACION.join(", ")}`,
  }),
  comentario: Joi.string().trim().max(255).messages({
    "string.base": "El comentario debe ser un texto",
    "string.max": "El comentario no puede superar los 255 caracteres",
  }),
});

export const assignationValidation = Joi.object({
  alumno: Joi.any().required().messages({
    "any.required": ALUMNO_OBLIGATORIO,
  }),
  calificacion_teorica: Joi.any(),
  resultado_manejo_1: Joi.any(),
  resultado_manejo_2: Joi.any(),
  resultado_manejo_3: Joi.any(),
  resultado_manejo_4: Joi.any(),
  resultado_manejo_5: Joi.any(),
  Resultado: Joi.any().required().messages({
    "any.required": "El resultado es obligatorio.",
  }),
  comentario: Joi.any().required().messages({
    "any.required": COMENTARIO_OBLIGATORIO,
  }),
})
  .unknown(false)
  .messages({
    "object.unknown": CAMPOS_ADICIONALES,
  });

export const updateValidation = Joi.object({
  alumno: Joi.any(),
  calificacion_teorica: Joi.any(),
  resultado_manejo_1: Joi.any(),
  resultado_manejo_2: Joi.any(),
  resultado_manejo_3: Joi.any(),
  resultado_manejo_4: Joi.any(),
  resultado_manejo_5: Joi.any(),
  Resultado: Joi.any(),
  comentario: Joi.any(),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
  });