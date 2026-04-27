"use strict";
import Joi from "joi";
import { DIAS_SEMANA, HORARIO_PATTERN, MIN_STRING,MAX_STRING, DIA_OBLIGATORIO, CAMPOS_ADICIONALES, HORA_INICIO_OBLIGATORIA, HORA_TERMINO_OBLIGATORIA } from "../constants/horario.constants.js";


export const integrityValidation = Joi.object({
    hora_inicio: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de inicio debe estar adentro de una cadena de caracteres",
        "string.pattern.base": "El formato de la hora es incorrecto"
    }),

    hora_fin: Joi.string().pattern(HORARIO_PATTERN).messages({
        "string.base": "La hora de inicio debe estar adentro de una cadena de caracteres",
        "string.pattern.base": "El formato de la hora es incorrecto"
    }),

    dia: Joi.string()
        .min(MIN_STRING)
        .max(MAX_STRING)
        .valid(...DIAS_SEMANA)
        .messages({
            "String.pattern.base":
                "el día solo puede contener letras números y guiones bajos",
            "any.valid":`El día debe ser uno se los siguientes ${DIAS_SEMANA.join(",")}`,
            "string.valid": `El día debe der uno de los siguientes ${DIAS_SEMANA.join(",")}`,
            "any.only":`El día debe ser uno se los siguientes ${DIAS_SEMANA.join(",")}`,
            "string.only": `El día debe der uno de los siguientes ${DIAS_SEMANA.join(",")}`
        })
})

export const assignationValidation = Joi.object({
  hora_inicio: Joi.any().required().messages({
        "any.required": HORA_INICIO_OBLIGATORIA,
    }),

  hora_fin: Joi.any().required().messages({
        "any.required": HORA_TERMINO_OBLIGATORIA, 
    }),

  dia: Joi.any().required().messages({
      "any.required": DIA_OBLIGATORIO,
      "any.valid": `El día debe ser uno de los siguientes: ${DIAS_SEMANA.join(", ")}`,
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": CAMPOS_ADICIONALES,
  });

export const updateValidation = Joi.object({
  hora_inicio: Joi.any(),
  hora_fin: Joi.any(),
  dia: Joi.any(),
}).min(1).unknown(false).messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
});