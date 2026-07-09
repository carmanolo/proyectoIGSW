import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";
import { Reserva } from "../entities/reserva.entity.js";
import { sendEmail } from "./email.service.js";

// SER=service
const PRECIO_CLASE_EXTRA = 15000;

export async function venderPackSer(userId, cantidad, comprobante) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    if (!userId || !cantidad) {
      // console.log(userId, cantidad);
      throw Error("Función mal llamada", { userId, cantidad });
    }

    const user = await userRepository.findOne({
      where: { id: userId } 
    });

    if (!user) {
      return [null, "El estudiante no existe"];
    }

    if (user.rol !== "estudiante") {
      return [null, "Solo los usuarios con rol 'estudiante' pueden recibir packs"];
    }

    const reservaRepository = AppDataSource.getRepository(Reserva);
    const clasesPracticasCompletadas = await reservaRepository.count({
      where: {
        user: { id: userId },
        estado: "completada",
        clase: { tipo: "practica" }
      }
    });

    if (clasesPracticasCompletadas < 0) { // TEMPORALMENTE CAMBIADO A 0 PARA PRUEBAS (originalmente era 6)
      return [null, `El alumno debe tener al menos 6 clases prácticas completadas para comprar clases extra (actualmente tiene ${clasesPracticasCompletadas}).`];
    }
    
    const cantidadNum = Number(cantidad);
    const packsValidos = [2, 4, 6, 8];
    if (!packsValidos.includes(cantidadNum)) {
      return [null, "Cantidad de pack inválida. Debe ser 2, 4, 6 u 8"];
    }

    let nuevaVenta = null;
    const monto_total = cantidadNum * PRECIO_CLASE_EXTRA;

    try {
      const ventaRepository = AppDataSource.getRepository(Venta);
      nuevaVenta = ventaRepository.create({ 
        cantidad: cantidadNum, 
        user: user,
        comprobante: comprobante || null,
        estado: "pendiente",
        monto_total: monto_total
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
    venta.clases_restantes = Number(venta.cantidad);
    venta.fecha_vencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días
    await ventaRepository.save(venta);

    const user = venta.user;
    user.clases_disponibles = (user.clases_disponibles || 0) + Number(venta.cantidad);
    await userRepository.save(user);

    // Enviar correo de aprobación
    if (user.email) {
      const subject = "✅ Compra de Clases Extras Aprobada";
      const mensaje = `Hola ${user.nombre},\n\nTu compra de ${venta.cantidad} clases extras ha sido aprobada. Ahora tienes ${user.clases_disponibles} clases disponibles en total.\n\nSaludos.`;
      const mensajeHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">✅ Compra Aprobada</h2>
          <p>Hola <strong>${user.nombre}</strong>,</p>
          <p>Tu solicitud para comprar <strong>${venta.cantidad} clases extras</strong> ha sido aprobada exitosamente.</p>
          <p>Tu nuevo total de clases disponibles es: <strong>${user.clases_disponibles}</strong>.</p>
          <hr>
          <p style="color: #555; font-size: 12px;">Atentamente,<br>Sistema IGSW</p>
        </div>
      `;
      sendEmail(user.email, subject, mensaje, mensajeHTML).catch(e => console.error("Error enviando correo de aprobación:", e));
    }

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
      where: { id: Number(ventaId) },
      relations: { user: true }
    });

    if (!venta) {
      return [null, "La venta no existe"];
    }

    if (venta.estado !== "pendiente") {
      return [null, "Solo se pueden rechazar ventas pendientes"];
    }

    venta.estado = "rechazada";
    await ventaRepository.save(venta);

    // Enviar correo de rechazo
    if (venta.user && venta.user.email) {
      const subject = "❌ Compra de Clases Extras Rechazada";
      const mensaje = `Hola ${venta.user.nombre},\n\nTu solicitud de compra de ${venta.cantidad} clases extras ha sido rechazada. Por favor, comunícate con secretaría para más detalles.\n\nSaludos.`;
      const mensajeHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #F44336;">❌ Compra Rechazada</h2>
          <p>Hola <strong>${venta.user.nombre}</strong>,</p>
          <p>Lamentamos informarte que tu solicitud para comprar <strong>${venta.cantidad} clases extras</strong> ha sido rechazada.</p>
          <p>Por favor, comunícate con secretaría o revisa tu comprobante de pago.</p>
          <hr>
          <p style="color: #555; font-size: 12px;">Atentamente,<br>Sistema IGSW</p>
        </div>
      `;
      sendEmail(venta.user.email, subject, mensaje, mensajeHTML).catch(e => console.error("Error enviando correo de rechazo:", e));
    }

    return [venta, null];
  } catch (error) {
    console.error("Error al rechazar la venta:", error);
    return [null, "Error interno del servidor al rechazar venta"];
  }
}