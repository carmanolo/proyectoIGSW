"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { venderPackSer, aprobarVentaSer, rechazarVentaSer, pagarVentaSer } from "../services/venta.service.js";
import { integrityValidation, assignationValidation } from "../validations/venta.validation.js";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";
import { Reserva } from "../entities/reserva.entity.js";
import { Clase } from "../entities/clase.entity.js";

export async function registrarVenta(req, res) {
    try {
        if(!req.body){
            // console.log(req.body);
            return res.status(400).json({ message: "Datos no proporcionados"});
        }

        const { userId, cantidad, tipo_pago = 'contado', cuotas = null } = req.body;
        
        if (tipo_pago === 'contado' && !req.file) {
            return res.status(400).json({ message: "El comprobante es obligatorio para pago al contado" });
        }
        
        let comprobante = null;
        if (req.file) {
            comprobante = `/uploads/${req.file.filename}`;
            req.body.comprobante = comprobante;
        }

        // console.log(userId, cantidad, comprobante); 

        const { error } = integrityValidation.validate(req.body);
        if (error) {
            return handleErrorClient(res, 400, "Parámetros inválidos", error.message);
        }

        let result = assignationValidation.validate(req.body);
        if(result.error){
            return handleErrorClient(res, 400, "Faltan parámetros", result.error.message);
        }

        const userRepository = AppDataSource.getRepository(User);
        const targetUser = await userRepository.findOneBy({ id: Number(userId) });
        if (!targetUser) {
            return handleErrorClient(res, 404, "Usuario no encontrado");
        }
        if (targetUser.rol !== "estudiante") {
            return handleErrorClient(res, 403, "Solo los usuarios con rol 'estudiante' pueden recibir packs");
        }

        const [resultVenta, errorServicio] = await venderPackSer(userId, cantidad, tipo_pago, comprobante, cuotas ? Number(cuotas) : null);

        if (errorServicio) {
            return handleErrorClient(res, 400, errorServicio);
        }

        if(resultVenta){
            return res.status(201).json({ message: "Solicitud de compra de pack registrada exitosamente. Pendiente de aprobación.", data: resultVenta});
        }else{
            return res.status(500).json({message: "Error al registrar la solicitud de venta"})
        }

    } catch (error) {
        console.error("error en registro de venta", error);
        return res.status(500).json({ message: "Error al registrar la solicitud de venta"});
    }
}



export async function aprobarVenta(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "El ID de la venta es obligatorio" });
        }

        const [resultVenta, errorServicio] = await aprobarVentaSer(id);

        if (errorServicio) {
            return handleErrorClient(res, 400, errorServicio);
        }

        return res.status(200).json({ message: "Venta aprobada exitosamente", data: resultVenta });
    } catch (error) {
        console.error("error al aprobar la venta", error);
        return res.status(500).json({ message: "Error interno al aprobar la venta" });
    }
}

export async function pagarVenta(req, res) {
    try {
        const { id } = req.params;
        const [result, errorServicio] = await pagarVentaSer(id);
        
        if (errorServicio) {
            return res.status(400).json({ message: errorServicio });
        }
        
        return res.status(200).json({ message: "Deuda saldada correctamente", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export async function rechazarVenta(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "El ID de la venta es obligatorio" });
        }

        const [resultVenta, errorServicio] = await rechazarVentaSer(id);

        if (errorServicio) {
            return handleErrorClient(res, 400, errorServicio);
        }

        return res.status(200).json({ message: "Venta rechazada exitosamente", data: resultVenta });
    } catch (error) {
        console.error("error al rechazar la venta", error);
        return res.status(500).json({ message: "Error interno al rechazar la venta" });
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

        const claseRepository = AppDataSource.getRepository(Clase);
        const clasesPracticasCompletadas = await claseRepository.count({
          where: {
            users: { id: Number(id) },
            estado_clase: "completada"
          }
        });

        const clases = user.clases_disponibles || 0;
        return handleSuccess(res, 200, "Clases disponibles obtenidas", { 
            id: user.id, 
            email: user.email, 
            clases_disponibles: clases,
            clases_practicas_completadas: clasesPracticasCompletadas
        });
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
            relations: { user: true },
            order: { fecha_venta: "DESC" }
        });

        return handleSuccess(res, 200, "Ventas del usuario obtenidas", ventas);
    } catch (error) {
        console.error("Error al listar ventas del usuario", error);
        return handleErrorServer(res, 500, "Error al obtener ventas del usuario", error.message);
    }
}

export async function listarVentas(req, res) {
    try {
        const ventaRepository = AppDataSource.getRepository(Venta);

        const ventas = await ventaRepository.find({
            relations: { user: true },
            order: { fecha_venta: "DESC" }
        });

        return handleSuccess(res, 200, "Ventas obtenidas", ventas);
    } catch (error) {
        console.error("Error al listar ventas", error);
        return handleErrorServer(res, 500, "Error al obtener ventas", error.message);
    }
}

export async function eliminarVenta(req, res) {
    try {
        const { id } = req.params;
        const ventaRepository = AppDataSource.getRepository(Venta);

        const venta = await ventaRepository.findOne({ where: { id: Number(id) }, relations: { user: true } });
        if (!venta) {
            return handleErrorClient(res, 404, "Venta no encontrada");
        }

        const user = venta.user;
        if (user && venta.estado === "aprobada") {
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
}export async function simularVencimiento(req, res) {
    try {
        const { id } = req.params;
        const ventaRepository = AppDataSource.getRepository(Venta);
        const venta = await ventaRepository.findOne({ where: { id: Number(id) } });
        if (!venta) return handleErrorClient(res, 404, "Venta no encontrada");
        
        // Retrasamos la fecha de vencimiento a hace 2 dias
        venta.fecha_vencimiento = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        await ventaRepository.save(venta);
        
        return handleSuccess(res, 200, "Vencimiento simulado (fecha atrasada 2 d�as)", venta);
    } catch (error) {
        return handleErrorServer(res, 500, "Error simulando vencimiento", error.message);
    }
}
