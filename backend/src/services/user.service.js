import { AppDataSource } from "../config/configDb.js";
import { SHOW_ERRORS } from "../constants/settings.constants.js";
import { TEACHER_ROLE } from "../constants/user.constants.js";
import { User } from "../entities/user.entity.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import { getErrorMessage, getResultLength, getServiceResult } from "./utils/utils.service.js";
import bcrypt from "bcrypt";

export async function getUserByIdFromService(id) {
  try {

    const userRepository = AppDataSource.getRepository(User);

    //buscar usuario en repositorio
    const userFound = await userRepository.findOne({ where: {id }, relations: {clase:true}});

    if(!userFound) {
      return getServiceResult(false, null, "Usuario no encontrado", 0)
    }

    delete userFound.password;
    return getServiceResult(false, userFound, "Usuario encontrado con éxito");

  } catch (error) {
    console.error("Error al obtener el usuario: ",error);
    return getServiceResult(true, null, getErrorMessage(error),0);
  }
}

export async function getUsersService() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        let users = await userRepository.find({relations: {clase: true}})

       if(users && Array.isArray(users)){
          for(let i = 0; i < users.length; i++){
            delete users[i].password;
          }
       }

       return getServiceResult(false, users, "Usuarios encontrados con éxito", getResultLength(users));

    } catch (error) {
        console.error("Error al obtener a los usuarios", error);
        return getServiceResult(true, null, getErrorMessage(error), 0)
       
    }
}

export async function updateUserService(id, newData) {
  try {

    const userRepository = AppDataSource.getRepository(User);

    //encuentra informacion sin actualizar

    const userFound = await userRepository.findOne({
      where: {id} , relations: {clase : true},
    });

    if(!userFound){
      return getServiceResult(false, null, "Usuario no encontrado", 0)
    }

    if(newData.password){
        newData.password = encryptPassword(newData.password);
    }

    //Object.assign(userFound, newData);

    if (newData.nombre) userFound.nombre = newData.nombre;
    if (newData.email) userFound.email = newData.email;
    if (newData.password) userFound.password = newData.password;
    if (newData.rol) userFound.rol = newData.rol;

     const savedUser = await userRepository.save(userFound);
    return getServiceResult(false, savedUser, "Usuario actualizado con éxito",1)

  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return getServiceResult(true, null, getErrorMessage(error), 0);
  }
}

export async function deleteUserService(id) {
    var queryRunner = {};

    try {
      const userRepository = AppDataSource.getRepository(User);
      queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.startTransaction();

      const userData = await userRepository.findOne({ where: {id}, relations: {clase:true}})
      
      if(!userData){
          return getServiceResult(false, null, "Usuario no encontrado",0)
      }

      const result = await userRepository.remove(userData);
      if(result.affected && result.affected !== 1){
          throw new Error("No se pudo eliminar usuario")
      }

      await queryRunner.commitTransaction();
      return getServiceResult(false, userData, "Usuario eliminado con exito",1)
    } catch (error) {
      console.error(error);
      if(queryRunner.rollbackTransaction){
        queryRunner.rollbackTransaction();
      }
      return getServiceResult(true, null, getErrorMessage(error), 0);
    }
}

export async function checkUserExists(userRepository, newData) {
    try {
        const existingEmailUser = await userRepository.findOne({where: { email: newData.email },relations: {clase: true}});
        console.log("EXISTING EMAIL USER: ", existingEmailUser);
        if (existingEmailUser) {
            return getServiceResult(false, null, "Correo ya registrado", 0);
        }
        const existingUsernameUser = await userRepository.findOne({ where: { nombre: newData.nombre },relations: {clase: true} });
        if (existingUsernameUser) {
            return getServiceResult(false, null, "Nombre de usuario ya registrado", 0);
        }
        return null;
    } catch (error) {
        return getServiceResult(false, null, "Error desconocido", 0);
    }
}

export async function createUserService(newData) {
  try {
      const userRepository = AppDataSource.getRepository(User);
      const result = await checkUserExists(userRepository, newData);
      console.log("RESULT: ", result);
      if(result !== null){
        return result;
      }

      newData.password = await encryptPassword(newData.password);

      const newUser = userRepository.create(newData);
      await userRepository.save(newUser);
      newUser.password = undefined;


      return getServiceResult(false, newUser, "Usuario registrado exitosamente",1);

  } catch (error) {
    console.error("Error en user.controller.js -> register", error);
    return getServiceResult(true, null, "Error al registar usaurio", 0)
  }
}

export async function findUserByEmail(email) {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: {email: email} });
}

export async function findTeacherByEmail(email) {
  if (SHOW_ERRORS) {
    console.log("EMAIL: ", email);
  }

  const user = (await findUserByEmail(email)) || null;
  if (SHOW_ERRORS) {
    console.log("¿Encontró al profesor?:", JSON.stringify(user));
  }
  if (user && (user?.rol !== TEACHER_ROLE)) {
    return null;
  }
  return user;
}

export async function getTeachers() {
  const DEFAULT_ARRAY = [];

  try {
    const userRepository = AppDataSource.getRepository(User);
    const teachers = await userRepository.find({where: {rol: TEACHER_ROLE}});
    if (!Array.isArray(teachers)) {
      return DEFAULT_ARRAY;
    }
    return teachers;
  } catch (error) {
    console.error("Error en user.controller.js -> getTeachers()", error);
    return DEFAULT_ARRAY;
  }
}