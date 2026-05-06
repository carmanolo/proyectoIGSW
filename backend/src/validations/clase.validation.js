"use strict";
import Joi from "joi";
import { DIAS_SEMANA, HORARIO_PATTERN, MIN_STRING,MAX_STRING, DIA_OBLIGATORIO, CAMPOS_ADICIONALES, HORA_INICIO_OBLIGATORIA, HORA_TERMINO_OBLIGATORIA,TIPO_CLASE, TIPO_OBLIGATORIO, DESCRIPCION_OBLIGATORIA,DESCRIPCION_PATTERN } from "../constants/clase.constants.js";

const enRango = (integer =0 , min=0, max=0) => {
    const _integer =Math.trunc(Number(integer) || 0);
    let temp = null;
    let _min = Math.trunc(Number(min || 0));
    let _max = Math.trunc(Number(max || 0));
    if(_min > _max){
        temp = _max;
        _max = min;
        _min = temp;
    }

    return (_integer >= _min && _integer <=max);
}

export const validacionHoraIntegridad = (hour) =>{
    const parsedHour = String(hour)
    const separatedHour = parsedHour.split(":");
    if(!(enRango(separatedHour[0], 0, 24))){
        return "las horas solo pueden ser de 0 a 23"
    }

    if(!(enRango(separatedHour[1], 0, 59))){
        return "los minutos solo pueden ser de 0 a 59"
    }
}

export const validateHoraNegocio = (hora_inicio, hora_fin) => {
  const _hora_inicio = String(hora_inicio);
  const _hora_fin = String(hora_fin);
  if (_hora_inicio.localeCompare(_hora_fin) >= 0) {
    return "La hora de término de la clase debe ser posterior a la hora de inicio";
  }
  return null;
}

export const integrityValidation = Joi.object({
    tipo:Joi.string()
        .min(MIN_STRING)
        .max(MAX_STRING)
        .valid(...TIPO_CLASE)
        .messages({
            "String.pattern.base":
                "el tipo solo puede contener letras números y guiones bajos",
            "any.valid":`El tipo debe ser uno se los siguientes ${TIPO_CLASE.join(",")}`,
            "string.valid": `El tipo debe der uno de los siguientes ${TIPO_CLASE.join(",")}`,
            "any.only":`El tipo debe ser uno se los siguientes ${TIPO_CLASE.join(",")}`,
            "string.only": `El tipo debe der uno de los siguientes ${TIPO_CLASE.join(",")}`

        }),
    descripcion:Joi.string().pattern(DESCRIPCION_PATTERN).messages({
        "string.base": "La decripcion debe estar adentro de una cadena de caracteres",
    }),

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
    tipo: Joi.any().required().messages({
        "any.required": TIPO_OBLIGATORIO,
        "any.valid": `El tipo debe ser uno de los siguientes: ${TIPO_CLASE.join(", ")}`,
    }),

    descripcion: Joi.any().required().messages({
        "any.required": DESCRIPCION_OBLIGATORIA,
    }),

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
    tipo:Joi.any(),
    descripcion:Joi.any(),
  hora_inicio: Joi.any(),
  hora_fin: Joi.any(),
  dia: Joi.any(),
}).min(1).unknown(false).messages({
    "object.min": "Se requiere al menos un campo para actualizar",
    "object.unknown": CAMPOS_ADICIONALES,
});