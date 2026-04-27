import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export function authorizeRoles(...rolesPermitidos){
    return async (req, res, next) => {
        try {
            const userRepository = AppDataSource.getRepository(User);

            const userFound = await userRepository.findOneBy({email: req.user.email});

            if(!userFound){
                return handleErrorClient(res, 404, "Usuario no encontrado en la base de datos")
            }

            const rolActual = userFound.rol;

            if(!rolesPermitidos.includes(rolActual)){
                return handleErrorClient(
                    res, 
                    403, 
                    "Acceso denegado: no se tienen permiso",
                    `Se rquiere uno de los siguientes roles: ${rolesPermitidos.join(", ")}`
                );
            }

            req.user.rol = rolActual;
            next();
        } catch (error) {
            return handleErrorServer(res, 500, "Error en verificación de rol", error.message);
        }
    };
}