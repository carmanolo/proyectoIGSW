import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Plan } from "../entities/Plan.entity.js";
import { Boleta } from "../entities/Boleta.entity.js";
import { REGISTRO_ESTADOS } from "../constants/user.constants.js";
import { getServiceResult } from "./utils/utils.service.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

const userRepository = AppDataSource.getRepository(User);
const planRepository = AppDataSource.getRepository(Plan);
const boletaRepository = AppDataSource.getRepository(Boleta);

export async function registrarUsuarioConBoletaService(datos, archivo) {
  try {
    const plan = await planRepository.findOne({
      where: { id_plan: datos.plan_id, estado: "activo" }
    });

    if (!plan) {
      return getServiceResult(false, null, "El plan seleccionado no está disponible", 0);
    }

    const usuarioExistente = await userRepository.findOne({
      where: { rut: datos.rut }
    });

    if (usuarioExistente) {
      return getServiceResult(false, null, "Ya existe un usuario con este RUT", 0);
    }

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

    const nuevaBoleta = boletaRepository.create({
      numero_boleta: `BOL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      monto: plan.costo,
      fecha_pago: new Date(),
      metodo_pago: datos.metodo_pago || "transferencia",
      url_comprobante: archivo.path,
      estado: "pendiente",
      usuario: usuarioGuardado,
      plan: plan,
      banco_origen: datos.banco_origen || null,
      banco_destino: datos.banco_destino || null,
      numero_cuenta_origen: datos.numero_cuenta_origen || null,
      rut_titular: datos.rut_titular || null,
      nombre_titular: datos.nombre_titular || null,
    });

    await boletaRepository.save(nuevaBoleta);
    delete usuarioGuardado.password;

    return getServiceResult(
      false,
      {
        usuario: usuarioGuardado,
        boleta: nuevaBoleta,
        plan: plan
      },
      "Solicitud registrada exitosamente con boleta en PDF",
      1
    );
  } catch (error) {
    console.error("Error al registrar:", error);
    return getServiceResult(true, null, error.message || "Error al procesar", 0);
  }
}

export async function obtenerListaEsperaService() {
  try {
    const usuarios = await userRepository.find({
      where: { estado_registro: REGISTRO_ESTADOS.EN_ESPERA },
      relations: {
        plan_contratado: true,
        boletas: true
      },
      order: {
        fecha_registro_espera: "ASC"
      }
    });

    usuarios.forEach(user => delete user.password);
    return getServiceResult(false, usuarios, "Lista obtenida", usuarios.length);
  } catch (error) {
    console.error("Error en obtenerListaEsperaService:", error);
    return getServiceResult(true, null, error.message, 0);
  }
}

export async function verificarRegistroService(id, datosVerificacion) {
  try {
    const usuario = await userRepository.findOne({
      where: { 
        id: id, 
        estado_registro: REGISTRO_ESTADOS.EN_ESPERA 
      },
      relations: {
        boletas: true,
        plan_contratado: true
      }
    });

    if (!usuario) {
      return getServiceResult(false, null, "Usuario no encontrado o no está en lista de espera", 0);
    }

    if (datosVerificacion.estado === 'verificado') {
      usuario.estado_registro = REGISTRO_ESTADOS.VERIFICADO;
      if (usuario.boletas && usuario.boletas.length > 0) {
        const boleta = usuario.boletas[0];
        boleta.estado = "verificada";
        boleta.fecha_verificacion = new Date();
        boleta.observaciones_verificacion = datosVerificacion.observaciones || null;
        await boletaRepository.save(boleta);
      }
    } else {
      usuario.estado_registro = REGISTRO_ESTADOS.RECHAZADO;
    }
    
    usuario.fecha_verificacion = new Date();
    usuario.observaciones_verificacion = datosVerificacion.observaciones || null;
    usuario.verificador_id = datosVerificacion.verificador_id || null;

    const usuarioActualizado = await userRepository.save(usuario);
    delete usuarioActualizado.password;

    return getServiceResult(
      false,
      usuarioActualizado,
      datosVerificacion.estado === "verificado" 
        ? "Usuario verificado exitosamente. Ya puede acceder al sistema."
        : "Solicitud de registro rechazada.",
      1
    );
  } catch (error) {
    console.error("Error al verificar registro:", error);
    return getServiceResult(true, null, error.message || "Error al verificar", 0);
  }
}

export async function obtenerDetalleSolicitudService(id) {
  try {
    const usuario = await userRepository.findOne({
      where: { id: id },
      relations: {
        plan_contratado: true,
        boletas: true
      }
    });

    if (!usuario) {
      return getServiceResult(false, null, "Solicitud no encontrada", 0);
    }

    delete usuario.password;

    return getServiceResult(
      false,
      usuario,
      "Detalle de solicitud obtenido exitosamente",
      1
    );
  } catch (error) {
    console.error("Error al obtener detalle de solicitud:", error);
    return getServiceResult(true, null, error.message || "Error al obtener detalle", 0);
  }
}

export async function contarSolicitudesPendientesService() {
  try {
    const count = await userRepository.count({
      where: { estado_registro: REGISTRO_ESTADOS.EN_ESPERA }
    });

    return getServiceResult(false, count, "Conteo de solicitudes pendientes", count);
  } catch (error) {
    console.error("Error al contar solicitudes:", error);
    return getServiceResult(true, null, error.message || "Error al contar", 0);
  }
}