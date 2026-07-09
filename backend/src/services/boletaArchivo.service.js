import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Plan } from "../entities/Plan.entity.js";
import { Boleta } from "../entities/Boleta.entity.js";
import { REGISTRO_ESTADOS } from "../constants/user.constants.js";
import { getServiceResult } from "./utils/utils.service.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import fs from 'fs';
import path from 'path';
import { sendSecretaryNotificationEmail } from "./email.service.js";
import { SECRETARIA_EMAIL } from "../config/configEnv.js";

const userRepository = AppDataSource.getRepository(User);
const planRepository = AppDataSource.getRepository(Plan);
const boletaRepository = AppDataSource.getRepository(Boleta);

export async function registrarBoletaConArchivoService(datos, archivo) {
  try {
    // 1. Verificar que el plan existe
    const plan = await planRepository.findOne({
      where: { id_plan: datos.plan_id, estado: "activo" }
    });

    if (!plan) {
      // Eliminar archivo si el plan no existe
      if (archivo && archivo.path) {
        fs.unlinkSync(archivo.path);
      }
      return getServiceResult(false, null, "El plan seleccionado no está disponible", 0);
    }

    // 2. Verificar RUT
    const usuarioExistente = await userRepository.findOne({
      where: { rut: datos.rut }
    });

    if (usuarioExistente) {
      // Eliminar archivo si el RUT ya existe
      if (archivo && archivo.path) {
        fs.unlinkSync(archivo.path);
      }
      return getServiceResult(false, null, "Ya existe un usuario con este RUT", 0);
    }

    // 3. Crear usuario en espera
    const nuevoUsuario = userRepository.create({
      nombre: datos.nombre,
      rut: datos.rut,
      telefono: datos.telefono,
      sede: datos.sede,
      email: datos.email || `espera_${Date.now()}@temp.com`,
      password: datos.password || await encryptPassword("temp123456"),
      rol: "estudiante",
      plan_contratado_id: datos.plan_id,
      estado_registro: REGISTRO_ESTADOS.EN_ESPERA,
      fecha_registro_espera: new Date(),
      clases_disponibles: plan.clases_totales || 0,
    });

    const usuarioGuardado = await userRepository.save(nuevoUsuario);

    // 4. Crear registro de boleta
    const nuevaBoleta = boletaRepository.create({
      numero_boleta: `BOL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      monto: plan.costo,
      fecha_pago: new Date(),
      metodo_pago: datos.metodo_pago || "transferencia",
      url_comprobante: archivo.path,
      estado: "pendiente",
      usuario: usuarioGuardado,
      plan: plan,
    });

    // Agregar datos de transferencia si vienen
    if (datos.banco_origen) nuevaBoleta.banco_origen = datos.banco_origen;
    if (datos.banco_destino) nuevaBoleta.banco_destino = datos.banco_destino;
    if (datos.numero_cuenta_origen) nuevaBoleta.numero_cuenta_origen = datos.numero_cuenta_origen;
    if (datos.rut_titular) nuevaBoleta.rut_titular = datos.rut_titular;
    if (datos.nombre_titular) nuevaBoleta.nombre_titular = datos.nombre_titular;

    await boletaRepository.save(nuevaBoleta);

    // Quitar datos sensibles
    delete usuarioGuardado.password;

    // Notificar a la secretaria
    try {
      if (SECRETARIA_EMAIL) {
        await sendSecretaryNotificationEmail(SECRETARIA_EMAIL, datos.nombre, datos.rut);
      }
    } catch (emailErr) {
      console.error("Error enviando notificación a la secretaria:", emailErr.message);
    }

    return getServiceResult(
      false,
      {
        usuario: usuarioGuardado,
        boleta: nuevaBoleta,
        plan: plan,
        archivo_validado: archivo.validation
      },
      "Solicitud de registro enviada exitosamente con boleta en PDF. Quedará en lista de espera para verificación.",
      1
    );

  } catch (error) {
    // Limpiar archivo en caso de error
    if (archivo && archivo.path) {
      try {
        fs.unlinkSync(archivo.path);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }
    console.error("Error al registrar boleta:", error);
    return getServiceResult(true, null, error.message || "Error al procesar la solicitud", 0);
  }
}

export async function verificarBoletaConArchivoService(id, datosVerificacion) {
  try {
    const boleta = await boletaRepository.findOne({
      where: { id_boleta: id },
      relations: ["usuario", "plan"]
    });

    if (!boleta) {
      return getServiceResult(false, null, "Boleta no encontrada", 0);
    }

    // Actualizar estado de la boleta
    boleta.estado = datosVerificacion.estado;
    boleta.fecha_verificacion = new Date();
    boleta.observaciones_verificacion = datosVerificacion.observaciones || null;

    await boletaRepository.save(boleta);

    // Si la boleta es verificada, actualizar usuario
    if (datosVerificacion.estado === "verificada" && boleta.usuario) {
      boleta.usuario.estado_registro = REGISTRO_ESTADOS.VERIFICADO;
      boleta.usuario.fecha_verificacion = new Date();
      boleta.usuario.verificador_id = datosVerificacion.verificador_id || null;
      await userRepository.save(boleta.usuario);
    }

    if (boleta.usuario) {
      delete boleta.usuario.password;
    }

    return getServiceResult(
      false,
      boleta,
      datosVerificacion.estado === "verificada" 
        ? "Boleta verificada exitosamente. Usuario registrado en el sistema."
        : "Boleta rechazada.",
      1
    );
  } catch (error) {
    console.error("Error al verificar boleta:", error);
    return getServiceResult(true, null, error.message || "Error al verificar la boleta", 0);
  }
}