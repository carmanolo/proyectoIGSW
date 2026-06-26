import { AppDataSource } from "../config/configDb.js";
import { Reserva } from "../entities/reserva.entity.js";
import { User } from "../entities/user.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";
import { Clase } from "../entities/clase.entity.js";

export async function createReservaSer(data) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const userRepository = AppDataSource.getRepository(User);
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const claseRepository = AppDataSource.getRepository(Clase);

    const { userId, vehiculoId, claseId, fecha, tipo } = data;

    const user = await userRepository.findOneBy({ id: Number(userId) });
    if (!user) return [null, "Usuario no encontrado"];

    const vehiculo = await vehiculoRepository.findOneBy({ id: Number(vehiculoId) });
    if (!vehiculo) return [null, "Vehículo no encontrado"];

    if (vehiculo.estado !== "disponible") {
      return [null, `El vehículo seleccionado no se encuentra disponible (estado: ${vehiculo.estado})`];
    }

    const clase = await claseRepository.findOneBy({ id_clase: Number(claseId) });
    if (!clase) return [null, "Clase no encontrada"];

    if (user.clases_disponibles <= 0 && tipo !== "pre_evaluacion") {
        // Asumimos que pre_evaluacion podría no descontar clase normal, o sí.
        // Si descuenta, quitamos la condicion. Por ahora validamos que tenga clases.
        return [null, "El alumno no tiene clases disponibles"];
    }

    // Validar choque de reservas para el mismo vehículo, fecha y clase
    const reservaExistente = await reservaRepository.findOne({
      where: {
        vehiculo: { id: Number(vehiculoId) },
        clase: { id_clase: Number(claseId) },
        fecha: fecha,
        estado: "pendiente"
      }
    });

    if (reservaExistente) {
      return [null, "El vehículo ya se encuentra reservado para esa fecha y clase"];
    }

    // Validar que el alumno no tenga ya una reserva para esa misma clase y fecha
    const reservaExistenteUser = await reservaRepository.findOne({
      where: {
        user: { id: Number(userId) },
        clase: { id_clase: Number(claseId) },
        fecha: fecha,
        estado: "pendiente"
      }
    });

    if (reservaExistenteUser) {
      return [null, "El alumno ya tiene una reserva para esa fecha y clase"];
    }

    // Descontar clase si corresponde
    if (tipo !== "pre_evaluacion") {
        user.clases_disponibles -= 1;
        await userRepository.save(user);
    }

    const nuevaReserva = reservaRepository.create({
      user,
      vehiculo,
      clase,
      fecha,
      tipo: tipo || "clase_regular",
      estado: "pendiente"
    });

    await reservaRepository.save(nuevaReserva);

    return [nuevaReserva, null];
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return [null, "Error interno del servidor al crear reserva"];
  }
}

export async function getReservasSer() {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const reservas = await reservaRepository.find({
        relations: { user: true, vehiculo: true, clase: true }
    });
    return [reservas, null];
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return [null, "Error interno del servidor al obtener reservas"];
  }
}

export async function getReservasUsuarioSer(userId) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const reservas = await reservaRepository.find({
        where: { user: { id: Number(userId) } },
        relations: { user: true, vehiculo: true, clase: true },
        order: { fecha: "DESC" }
    });
    return [reservas, null];
  } catch (error) {
    console.error("Error al obtener reservas del usuario:", error);
    import('fs').then(fs => fs.writeFileSync('reserva_error_log.txt', String(error) + '\n' + JSON.stringify(error, null, 2) + '\n' + error.stack));
    return [null, "Error interno del servidor al obtener reservas del usuario"];
  }
}

export async function updateReservaEstadoSer(id, estado) {
  try {
    const validEstados = ["pendiente", "completada", "no_realizada", "cancelada"];
    if (!validEstados.includes(estado)) {
      return [null, "Estado no válido"];
    }

    const reservaRepository = AppDataSource.getRepository(Reserva);
    const userRepository = AppDataSource.getRepository(User);
    
    const reserva = await reservaRepository.findOne({
      where: { id: Number(id) },
      relations: { user: true }
    });

    if (!reserva) {
      return [null, "Reserva no encontrada"];
    }

    // Si la reserva pasa a 'cancelada' desde 'pendiente' y no era pre_evaluacion, devolvemos el cupo al usuario
    if (estado === "cancelada" && reserva.estado === "pendiente" && reserva.tipo !== "pre_evaluacion") {
      if (reserva.user) {
        reserva.user.clases_disponibles += 1;
        await userRepository.save(reserva.user);
      }
    }

    reserva.estado = estado;
    await reservaRepository.save(reserva);

    return [reserva, null];
  } catch (error) {
    console.error("Error al actualizar el estado de la reserva:", error);
    return [null, "Error interno del servidor al actualizar estado"];
  }
}

export async function getOcupacionVehiculosSer() {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const reservas = await reservaRepository.find({
        where: [
            { estado: "pendiente" },
            { estado: "completada" }
        ],
        relations: { vehiculo: true, clase: true },
        select: {
            id: true,
            fecha: true,
            vehiculo: { id: true },
            clase: { id_clase: true }
        }
    });
    return [reservas, null];
  } catch (error) {
    console.error("Error al obtener ocupación de vehículos:", error);
    return [null, "Error interno del servidor al obtener ocupación"];
  }
}
