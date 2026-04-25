"use strict";
import User from "../entity/user.entity.js";
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
        email: "ignacio.admin@gmail.com",
        password: await encryptPassword("admin2025"),
        rol: "secretario",
      })),
      userRepository.save(userRepository.create({
        email: "martina.presi@gmail.com",
        password: await encryptPassword("presi2025"),
        rol: "profesor",
      })),
      userRepository.save(userRepository.create({
  
        email: "leo.secre@gmail.com",
        password: await encryptPassword("secre2025"),
        rol: "alumnos",
      })),
    ]);

    console.log("* => Usuarios creados");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { iniciarUsuarios };