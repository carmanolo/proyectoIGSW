import Joi from "joi";

const PACKS_VALIDOS = [2, 4, 6, 8];

const integrityValidation = Joi.object({
    userId: Joi.number().integer().positive(),
    cantidad: Joi.number().integer().valid(...PACKS_VALIDOS),
    comprobante_url: Joi.string()
});

const body1 = { userId: "1", cantidad: "2", comprobante_url: "/uploads/file.png" };
console.log("body1:", integrityValidation.validate(body1).error?.message || "OK");

const body2 = { userId: 1, cantidad: "2", comprobante_url: "/uploads/file.png" };
console.log("body2:", integrityValidation.validate(body2).error?.message || "OK");
