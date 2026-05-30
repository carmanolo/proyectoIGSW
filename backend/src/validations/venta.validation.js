"use strict";
import Joi from "joi";
import { 
    PACKS_VALIDOS, 
    CAMPOS_ADICIONALES, 
    USUARIO_ID_OBLIGATORIO, 
    CANTIDAD_OBLIGATORIA, 
    ERROR_ID_INVALIDO, 
    ERROR_CANTIDAD_INVALIDA 
} from "../constants/venta.constants.js";


export const integrityValidation = Joi.object({
    userId: Joi.number().integer().positive().messages({
        "number.base": ERROR_ID_INVALIDO,
        "number.integer": ERROR_ID_INVALIDO,
        "number.positive": ERROR_ID_INVALIDO
    }),

    cantidad: Joi.number().integer().valid(...PACKS_VALIDOS).messages({
        "number.base": ERROR_CANTIDAD_INVALIDA,
        "any.only": `La cantidad de clases debe ser una de las siguientes: ${PACKS_VALIDOS.join(", ")}`
    })
});


export const assignationValidation = Joi.object({
    userId: Joi.any().required().messages({
        "any.required": USUARIO_ID_OBLIGATORIO,
    }),

    cantidad: Joi.any().required().messages({
        "any.required": CANTIDAD_OBLIGATORIA,
    }),
})
    .unknown(false)
    .messages({
        "object.unknown": CAMPOS_ADICIONALES,
    });


export const updateValidation = Joi.object({
    userId: Joi.any(),
    cantidad: Joi.any(),
})
    .min(1)
    .unknown(false)
    .messages({
        "object.min": "Se requiere al menos un campo para actualizar",
        "object.unknown": CAMPOS_ADICIONALES,
    });