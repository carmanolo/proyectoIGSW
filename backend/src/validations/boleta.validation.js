"use strict";
import Joi from "joi";
import { METODOS_PAGO } from "../constants/boleta.constants.js";

export const boletaValidation = Joi.object({
  numero_boleta: Joi.string().pattern(/^[0-9]{10,20}$/).required().messages({
    "string.empty": "El número de boleta es obligatorio",
    "string.pattern.base": "El número de boleta debe tener entre 10 y 20 dígitos",
  }),
  
  monto: Joi.number().positive().required().messages({
    "number.base": "El monto debe ser un número",
    "number.positive": "El monto debe ser mayor a 0",
    "any.required": "El monto es obligatorio",
  }),
  
  metodo_pago: Joi.string().valid(...Object.values(METODOS_PAGO)).required().messages({
    "any.only": "Método de pago no válido",
    "any.required": "El método de pago es obligatorio",
  }),
  
  banco_origen: Joi.string().when('metodo_pago', {
    is: 'transferencia',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow('', null),
  }),
  
  banco_destino: Joi.string().when('metodo_pago', {
    is: 'transferencia',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow('', null),
  }),
  
  numero_cuenta_origen: Joi.string().when('metodo_pago', {
    is: 'transferencia',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow('', null),
  }),
  
  rut_titular: Joi.string().pattern(/^[0-9]{1,8}-[0-9kK]{1}$/).when('metodo_pago', {
    is: 'transferencia',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow('', null),
  }),
  
  nombre_titular: Joi.string().max(100).when('metodo_pago', {
    is: 'transferencia',
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow('', null),
  }),
}).unknown(false);

export const verificacionBoletaValidation = Joi.object({
  estado: Joi.string().valid("verificada", "rechazada").required(),
  observaciones: Joi.string().max(500).optional().allow('', null),
}).unknown(false);