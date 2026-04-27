"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { venderPackSer } from "../services/venta.service.js";
import { integrityValidation, assignationValidation } from "../validations/venta.validation.js";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";

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
            const { password, clases_disponibles, ...usuarioSeguro } = updatedUser;
            return res.status(201).json({ message: "Venta de pack registrada exitosamente", data: usuarioSeguro});
        }else{
            return res.status(500).json({message: "Error al registrar la venta"})
        }

    } catch (error) {
        console.error("error en registro de venta", error);
        return res.status(500).json({ message: "Error al registrar la venta"});
    }
}

export async function obtenerClasesUsuario(req, res) {
    try {
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: Number(id) });

        if (!user) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }

        const clases = user.clases_disponibles || 0;
        return handleSuccess(res, 200, "Clases disponibles obtenidas", { id: user.id, email: user.email, clases_disponibles: clases });
    } catch (error) {
        console.error("Error al obtener clases del usuario", error);
        return handleErrorServer(res, 500, "Error al obtener clases del usuario", error.message);
    }
}

export async function listarVentasUsuario(req, res) {
    try {
        const { id } = req.params;
        const ventaRepository = AppDataSource.getRepository(Venta);

        const ventas = await ventaRepository.find({
            where: { user: { id: Number(id) } },
            relations: ["user"],
            order: { fecha_venta: "DESC" }
        });

        return handleSuccess(res, 200, "Ventas del usuario obtenidas", ventas);
    } catch (error) {
        console.error("Error al listar ventas del usuario", error);
        return handleErrorServer(res, 500, "Error al obtener ventas del usuario", error.message);
    }
}

export async function eliminarVenta(req, res) {
    try {
        const { id } = req.params;
        const ventaRepository = AppDataSource.getRepository(Venta);

        const venta = await ventaRepository.findOne({ where: { id: Number(id) }, relations: ["user"] });
        if (!venta) {
            return handleErrorClient(res, 404, "Venta no encontrada");
        }

        const user = venta.user;
        if (user) {
            const userRepository = AppDataSource.getRepository(User);
            user.clases_disponibles = Math.max(0, (user.clases_disponibles || 0) - Number(venta.cantidad));
            await userRepository.save(user);
        }
        await ventaRepository.remove(venta);

        return handleSuccess(res, 200, "Venta eliminada correctamente", { id: venta.id });
    } catch (error) {
        console.error("Error al eliminar venta", error);
        return handleErrorServer(res, 500, "Error al eliminar la venta", error.message);
    }
}