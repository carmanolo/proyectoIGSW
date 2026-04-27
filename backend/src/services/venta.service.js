import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Venta } from "../entities/venta.entity.js";

// SER=service
export async function venderPackSer(userId, cantidad) {
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


    
    const packsValidos = [2, 4, 6, 8];
    if (!packsValidos.includes(cantidad)) {
    return [null, "Cantidad de pack inválida. Debe ser 2, 4, 6 u 8"];
    }

    
    user.clases_disponibles = (user.clases_disponibles || 0) + Number(cantidad);

    
    const updatedUser = await userRepository.save(user);

    try {
    const ventaRepository = AppDataSource.getRepository(Venta);
    const nuevaVenta = ventaRepository.create({ cantidad: Number(cantidad), user: user });
    await ventaRepository.save(nuevaVenta);
    } catch (err) {
    console.error("Error al guardar registro de venta:", err);
    
    }


    return [updatedUser, null];

} catch (error) {
    console.error("Error al registrar la venta del pack:", error);
    return [null, "Error interno del servidor"];
}
}