"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { timestampValidationFunction } from "./modules/timestap.validation.js";
import { MAX_FULLNAME, MIN_FULLNAME, VALID_EMAIL_DOMAINS, FULLNAME_REGEX, VALID_ROLES, STUDENT_ROLE, MIN_DATE_LENGTH, MAX_DATE_LENGTH } from "../constants/user.constants.js";

export const emailDomainValidationFunction = (value, helpers) => {
    for (const domain in VALID_EMAIL_DOMAINS) {
        if (value.endsWith && value.endsWith(VALID_EMAIL_DOMAINS[domain])) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes dominios: ${VALID_EMAIL_DOMAINS.join(", ")}`);
}

export const integrityValidation = Joi.object({
    id: Joi.any().custom(idValidationFunction),

    nombre: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).pattern(FULLNAME_REGEX).messages({
        "string.base": "El nombre de usuario debe ser un string",
        "string.empty": "El nombre no puede ser vacío",
        "string.min": `El nombre debe al menos ser de ${MIN_FULLNAME} caracteres`,
        "string.max": `El nombre no puede tener más de ${MAX_FULLNAME} caracteres`,
        "string.pattern.base": "El nombre solo puede tener letras y espacios"
    }),
    rut: Joi.string().pattern(/^[0-9]{1,8}-[0-9kK]{1}$/).required().messages({
        "string.base": "El rut debe ser un string",
        "string.empty": "El rut es obligatorio",
        "string.pattern.base": "El RUT debe tener formato válido (ej: 12345678-9)",
        "any.required": "El RUT es obligatorio"
    }),
    email: Joi.string().email().min(1).max(MAX_FULLNAME).custom(emailDomainValidationFunction).messages({
        "string.base": "El correo debe ser un string",
        "string.min": "El correo no puede ser vacío",
        "string.empty": "El correo no puede ser vacío",
        "string.email": "Correo malformado",
        "string.max": `El correo no debe ser de más de ${MAX_FULLNAME} caracteres`,
    }),
    password: Joi.string().min(1).max(MAX_FULLNAME).messages({
        "string.base": "La contraseña debe ser un string",
        "string.min": "La contraseña no puede ser vacía",
        "string.empty": "La contraseña no puede ser vacía",
        "string.max": `La contraseña debe tener menos de ${MAX_FULLNAME} caracteres`,
    }),

      rol: Joi.string().min(1).max(MAX_FULLNAME).valid(...VALID_ROLES).required().messages({
        "string.base": "El rol debe ser un string",
        "string.min": "El rol no puede ser vacío",
        "string.empty": "El rol no puede ser vacío",
        "string.max": `El rol no debe ser de más de ${MAX_FULLNAME} caracteres`,
        "any.required": "El rol es obligatorio"
    }),
    created_at: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de creación debe ser un string",
        "string.min": "La fecha de creación no puede ser vacía",
        "string.empty": "La fecha de creación no puede ser vacía",
        "string.max": `La fecha debe ser de menos de ${MAX_DATE_LENGTH}`,
    }),
    updated_at: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base": "La fecha de actualización debe ser un string",
        "string.min": "La fecha de actualización no puede ser vacía",
        "string.empty": "La fecha de actualización no puede ser vacía",
        "string.max": `La fecha debe ser de menos de ${MAX_DATE_LENGTH}`,        
    }),
}).unknown(false).messages({
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",
})

export const createValidation = Joi.object({
    nombre: Joi.any().required().messages({
        "any.required": "El nombre completo es obligatorio",
    }),
    rut: Joi.any().required().messages({  
        "any.required": "El RUT es obligatorio",
    }),
    email: Joi.any().required().messages({
        "any.required":"El correo electrónico es obligatorio"
    }),
    password: Joi.any().required().messages({
        "any.required":"La contraseña es obligatria"
    }),
    rol: Joi.any().required().messages({
        "any.required":"El rol es obligatorio",
        "any.valid": `El rol debe ser uno de los siguientes: ${STUDENT_ROLE}`,
    }),
}).min(1).unknown(false)
  .messages({
    "object.min":"Debe proporcionar al menos un campo para actualizar",
    "any.min":"Debe proporcionar al menos un campo para actualizar",
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales", 
  });

export const updateValidation = Joi.object({
    nombre: Joi.any(),
    rut: Joi.any(),
    email: Joi.any(),
    password: Joi.any(),
    rol: Joi.any(),    
}).min(1).unknown(false).messages({
    "object.min":"Debe proporcionar al menos un campo para actualizar",
    "any.min":"Debe proporcionar al menos un campo para actualizar",
    "any.unknown":"No se permiten campos adicionales",
    "object.unknown":"No se permiten campos adicionales",    
});

