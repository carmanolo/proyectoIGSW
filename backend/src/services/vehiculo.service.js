import { AppDataSource } from "../config/configDb.js";
import { Reserva } from "../entities/reserva.entity.js";
import { User } from "../entities/user.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";
import { Horario } from "../entities/horario.entity.js";

export async function createReservaSer(data) {
  try {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const userRepository = AppDataSource.getRepository(User);
    const vehiculoRepository = AppDataSource.getRepository(Vehiculo);
    const horarioRepository = AppDataSource.getRepository(Horario);

    const { userId, vehiculoId, horarioId, fecha, tipo } = data;

    const user = await userRepository.findOneBy({ id: Number(userId) });
    if (!user) return [null, "Usuario no encontrado"];

    const vehiculo = await vehiculoRepository.findOneBy({ id: Number(vehiculoId) });
    if (!vehiculo) return [null, "Vehículo no encontrado"];

    const horario = await horarioRepository.findOneBy({ id_horario: Number(horarioId) });
    if (!horario) return [null, "Horario no encontrado"];

    if (user.clases_disponibles <= 0 && tipo !== "pre_evaluacion") {
        // Asumimos que pre_evaluacion podría no descontar clase normal, o sí.
        // Si descuenta, quitamos la condicion. Por ahora validamos que tenga clases.
        return [null, "El alumno no tiene clases disponibles"];
    }

    // Validar choque de reservas para el mismo vehículo, fecha y horario
    const reservaExistente = await reservaRepository.findOne({
      where: {
        vehiculo: { id: Number(vehiculoId) },
        horario: { id_horario: Number(horarioId) },
        fecha: fecha,
        estado: "activa"
      }
    });

    if (reservaExistente) {
      return [null, "El vehículo ya se encuentra reservado para esa fecha y horario"];
    }

    // Descontar clase si corresponde
    if (tipo !== "pre_evaluacion") {
        user.clases_disponibles -= 1;
        await userRepository.save(user);
    }

    const nuevaReserva = reservaRepository.create({
      user,
      vehiculo,
      horario,
      fecha,
      tipo: tipo || "clase_regular",
      estado: "activa"
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
        relations: ["user", "vehiculo", "horario"]
    });
    return [reservas, null];
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return [null, "Error interno del servidor al obtener reservas"];
  }
}
