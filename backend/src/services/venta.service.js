import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";

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

    if (!user.clases_basicas_completadas) {
      return [null, "El alumno no ha completado sus clases prácticas básicas"];
    }
    
    const packsValidos = [2, 4, 6, 8];
    if (!packsValidos.includes(cantidad)) {
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
      relations: ["user"]
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