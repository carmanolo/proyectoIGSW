"use strict";
import User from "../entities/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function iniciarUsuarios() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    const now = new Date();

    await Promise.all([
      userRepository.save(userRepository.create({
        email: "ignacio.@gmail.com",
        password: await encryptPassword("secre2026"),
        rol: "secretario",
      })),
      userRepository.save(userRepository.create({
        email: "martina.@gmail.com",
        password: await encryptPassword("profe2026"),
        rol: "profesor",
      })),
      userRepository.save(userRepository.create({
  
        email: "leo.@gmail.com",
        password: await encryptPassword("alum2026"),
        rol: "alumnos",
      })),
    ]);

    console.log(" => Usuarios creados");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { iniciarUsuarios };