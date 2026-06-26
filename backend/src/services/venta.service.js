import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";
import { Reserva } from "../entities/reserva.entity.js";

// SER=service
export async function venderPackSer(userId, cantidad, comprobante_url) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    if (!userId || !cantidad) {
      console.log(userId, cantidad);
      throw Error("Función mal llamada", { userId, cantidad });
    }

    const user = await userRepository.findOne({
      where: { id: userId } 
    });

    if (!user) {
      return [null, "El estudiante no existe"];
    }

    if (user.rol !== "alumnos") {
      return [null, "Solo los usuarios con rol 'alumnos' pueden recibir packs"];
    }

    const reservaRepository = AppDataSource.getRepository(Reserva);
    const clasesPracticasCompletadas = await reservaRepository.count({
      where: {
        user: { id: userId },
        estado: "completada",
        clase: { tipo: "practica" }
      }
    });

    if (clasesPracticasCompletadas < 6) {
      return [null, `El alumno debe tener al menos 6 clases prácticas completadas para comprar clases extra (actualmente tiene ${clasesPracticasCompletadas}).`];
    }
    
    const cantidadNum = Number(cantidad);
    const packsValidos = [2, 4, 6, 8];
    if (!packsValidos.includes(cantidadNum)) {
      return [null, "Cantidad de pack inválida. Debe ser 2, 4, 6 u 8"];
    }

    let nuevaVenta = null;
    try {
      const ventaRepository = AppDataSource.getRepository(Venta);
      nuevaVenta = ventaRepository.create({ 
        cantidad: Number(cantidad), 
        user: user,
        comprobante_url: comprobante_url || null,
        estado: "pendiente"
      });
      nuevaVenta = await ventaRepository.save(nuevaVenta);
    } catch (err) {
      console.error("Error al guardar registro de venta:", err);
      return [null, "Error al crear la solicitud de venta"];
    }

    return [nuevaVenta, null];

  } catch (error) {
    console.error("Error al registrar la venta del pack:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function aprobarVentaSer(ventaId) {
  try {
    const ventaRepository = AppDataSource.getRepository(Venta);
    const userRepository = AppDataSource.getRepository(User);

    const venta = await ventaRepository.findOne({
      where: { id: Number(ventaId) },
      relations: { user: true }
    });

    if (!venta) {
      return [null, "La venta no existe"];
    }

    if (venta.estado !== "pendiente") {
      return [null, "La venta ya ha sido procesada (aprobada o rechazada)"];
    }

    venta.estado = "aprobada";
    await ventaRepository.save(venta);

    const user = venta.user;
    user.clases_disponibles = (user.clases_disponibles || 0) + Number(venta.cantidad);
    await userRepository.save(user);

    return [venta, null];
  } catch (error) {
    console.error("Error al aprobar la venta:", error);
    return [null, "Error interno del servidor al aprobar venta"];
  }
}

export async function rechazarVentaSer(ventaId) {
  try {
    const ventaRepository = AppDataSource.getRepository(Venta);

    const venta = await ventaRepository.findOne({
      where: { id: Number(ventaId) }
    });

    if (!venta) {
      return [null, "La venta no existe"];
    }

    if (venta.estado !== "pendiente") {
      return [null, "Solo se pueden rechazar ventas pendientes"];
    }

    venta.estado = "rechazada";
    await ventaRepository.save(venta);

    return [venta, null];
  } catch (error) {
    console.error("Error al rechazar la venta:", error);
    return [null, "Error interno del servidor al rechazar venta"];
  }
}