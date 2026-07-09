import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "./user.service.js";
import { getServiceResult } from "./utils/utils.service.js";


//logear usaurio

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { sub: user.id, email: user.email, rol: user.rol };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

  delete user.password;
  return { user, token };
}

//cerrar sesion
export async function logoutUserFromService(clearCookieFunction) {
  try {
    clearCookieFunction("jwt", { httpOnly: true });
    return getServiceResult(false, null, "Sesión cerrada exitosamente", 0);
  } catch (error) {
    // console.error("Error en auth.controller.js -> login(): ", error);
    return getServiceResult(true, null, "Error al cerrar sesión", 0);
  }
}
