"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { venderPackSer } from "../services/venta.service.js";
import { integrityValidation, assignationValidation } from "../validations/venta.validation.js";

export async function registrarVenta(req, res) {
    try {
        let updatedUser = null;

        if(!req.body){
            console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { userId, cantidad } = req.body;
        console.log(userId, cantidad); 

        
        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        
        let result = assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "Faltan parámetros", result.error.message);
        }


        const [resultUser, errorServicio] = await venderPackSer(userId, cantidad);

        if (errorServicio) {
            return handleErrorClient(res, 400, errorServicio);
        }


        if(updatedUser = resultUser){

            const { password, ...usuarioSeguro } = updatedUser;
            return res.status(201).json({ message: "Venta de pack registrada exitosamente", data: usuarioSeguro});
        }else{
            return res.status(500).json({message: "Error al registrar la venta"})
        }

    } catch (error) {
        console.error("error en registro de venta", error);
        return res.status(500).json({ message: "Error al registrar la venta"});
    }
}