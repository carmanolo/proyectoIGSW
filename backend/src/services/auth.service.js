import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getServiceResult } from "./utils/utils.service.js";

export async function loginUser(email, password) {
    console.log('🔍 Intentando login con:', email);
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  console.log('👤 Usuario encontrado:', user ? user.email : 'NO ENCONTRADO');
  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  const isMatch = await bcrypt.compare(password, user.password);
   console.log('🔑 Contraseña válida:', isMatch);
  if (!isMatch) {
    throw new Error("Credenciales incorrectas");
  }

  const payload = { 
    id: user.id, 
    email: user.email, 
    rol: user.rol,
    nombre: user.nombre || email.split('@')[0]
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: "5h" });

  const userData = { ...user };
  delete userData.password;
  
  return { user: userData, token };
}

export async function logoutUserFromService(clearCookieFunction) {
  try {
    clearCookieFunction("jwt", { httpOnly: true });
    return getServiceResult(false, null, "Sesión cerrada exitosamente", 0);
    console.log('✅ Login exitoso:', userData.email);
  } catch (error) {
    return getServiceResult(true, null, "Error al cerrar sesión", 0);
    console.error('❌ Error en loginUser:', error);
  }
}