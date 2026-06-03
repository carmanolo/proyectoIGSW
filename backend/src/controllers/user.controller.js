"use strict";
import { getUserByIdFromService,getUsersService, createUserService, updateUserService, deleteUserService } from "../services/user.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { integrityValidation, updateValidation, createValidation } from "../validations/user.validation.js";

export async function getUsers(req, res) {
  const users = await getUsersService();

  if(users.error){
    return handleErrorServer(res, 500, "error en el servidor", users.details, JSON.stringify(users));
  }

  if(users.length <= 0){
    return handleErrorClient(res, 404, "No existen usaurios");
  }

  return handleSuccess(res, 200, "Usuarios encontrados exitosamente", users);

}

export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({message:"el id es obligatorio"});
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id inexistente");
  }

  const user = await getUserByIdFromService(id);
  console.log(user);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno de srvidor", user.details, JSON.stringify(user));
  }

  //verificar si el usuario fue encontrado
  if (!user) {
    user.error = true;
    return handleErrorClient(res, 404, "Usuarios no encontrados");
  }

  return handleSuccess(res, 200, "Usuario encontrado con exito", user);
}

export async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({message: "No se ha proporcionado ningún dato"});
  }

  var validationResult = createValidation.validate(req.body);
  console.log(validationResult);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos create")
  }     
  var validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos");
  }

  const user = await createUserService(req.body);
  console.log(user);
  if(user.error){
    return handleErrorServer(res, 500, "Error interno del servidor", user.error, JSON.stringify(user));
  }

  if (!user.data) {
    if (user.details && user.details.endsWith("ya registrado")) {
      return handleErrorClient(res, 409, user.details, user);
    }

    return handleErrorClient(res, 400, "Error al registar usuario",user);
  }

  return handleSuccess(res, 201, user.details, user.data);

}

export async function updateUser(req, res) {
    const { id } = req.params;

    const newData = req.body || null;

    if(!newData){
      return handleErrorClient(res, 400, "datos no proporcionados", null);
    }

     if (!id) {
      return res.status(400).json({message: "el id e sobligatorio"});
     }

     const result = idValidation.validate({id: id});
    if (result.error) {
      return res.status(400).json({message:"Id invalido"}, error);
    }

    var validationResult = integrityValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }

    validationResult = updateValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }  

    const editedUser = await updateUserService(id, newData);
    if(editedUser.error){
      return handleErrorServer(res, 500, "Error interno del sevidor", editedUser.details, JSON.stringify(editedUser));
    }

    if(editedUser.length <= 0){
      editedUser.error = true
      return handleErrorClient(res, 400, "Error deconocido",editedUser);
    }

    return handleSuccess(res, 200, "Usuario editado con exito", editedUser.details);
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El id es obligatorio"});
  } 
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id invalido");
  }
  if (id === req.user.id) {
    return handleErrorClient(res, 400, "No se puede eliminar a si mismo");
  }

  const user = await deleteUserService(id);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno del servidor", user.details, JSON.stringify(user));
  }
  if (user.length <= 0) {
    user.error = true;
    return handleErrorClient(res, 404, "Uusario no encontrado")
  }

  return handleSuccess(res, 200, "Usuario eliinado exitosamente", user);
}

/* export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({message:"el id es obligatorio"});
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id inexistente");
  }

  const user = await getUserByIdFromService(id);
  console.log(user);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno de srvidor", user.details, JSON.stringify(user));
  }

  //verificar si el usuario fue encontrado
  if (!user) {
    user.error = true;
    return handleErrorClient(res, 404, "Usuarios no encontrados");
  }

  return handleSuccess(res, 200, "Usuario encontrado con exito", user);
}

export async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({message: "No se ha proporcionado ningún dato"});
  }

  var validationResult = createValidation.validate(req.body);
  console.log(validationResult);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos create")
  }     
  var validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos");
  }

  const user = await createUserService(req.body);
  console.log(user);
  if(user.error){
    return handleErrorServer(res, 500, "Error interno del servidor", user.error, JSON.stringify(user));
  }

  if (!user.data) {
    if (user.details && user.details.endsWith("ya registrado")) {
      return handleErrorClient(res, 409, user.details, user);
    }

    return handleErrorClient(res, 400, "Error al registar usuario",user);
  }

  return handleSuccess(res, 201, user.details, user.data);

}

export async function updateUser(req, res) {
    const { id } = req.params;

    const newData = req.body || null;

    if(!newData){
      return handleErrorClient(res, 400, "datos no proporcionados", null);
    }

     if (!id) {
      return res.status(400).json({message: "el id e sobligatorio"});
     }

     const result = idValidation.validate({id: id});
    if (result.error) {
      return res.status(400).json({message:"Id invalido"}, error);
    }

    var validationResult = integrityValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }

    validationResult = updateValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }  

    const editedUser = await updateUserService(id, newData);
    if(editedUser.error){
      return handleErrorServer(res, 500, "Error interno del sevidor", editedUser.details, JSON.stringify(editedUser));
    }

    if(editedUser.length <= 0){
      editedUser.error = true
      return handleErrorClient(res, 400, "Error deconocido",editedUser);
    }

    return handleSuccess(res, 200, "Usuario editado con exito", editedUser.details);
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El id es obligatorio"});
  } 
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id invalido");
  }
  if (id === req.user.id) {
    return handleErrorClient(res, 400, "No se puede eliminar a si mismo");
  }

  const user = await deleteUserService(id);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno del servidor", user.details, JSON.stringify(user));
  }
  if (user.length <= 0) {
    user.error = true;
    return handleErrorClient(res, 404, "Uusario no encontrado")
  }

  return handleSuccess(res, 200, "Usuario eliinado exitosamente", user);
}

export async function getUserById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({message:"el id es obligatorio"});
  }
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id inexistente");
  }

  const user = await getUserByIdFromService(id);
  console.log(user);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno de srvidor", user.details, JSON.stringify(user));
  }

  //verificar si el usuario fue encontrado
  if (!user) {
    user.error = true;
    return handleErrorClient(res, 404, "Usuarios no encontrados");
  }

  return handleSuccess(res, 200, "Usuario encontrado con exito", user);
}

export async function createUser(req, res) {
  if (!req.body) {
    return res.status(400).json({message: "No se ha proporcionado ningún dato"});
  }

  var validationResult = createValidation.validate(req.body);
  console.log(validationResult);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos create")
  }     
  var validationResult = integrityValidation.validate(req.body);
  if (validationResult.error) {
    return handleErrorClient(res, 400, "Datos inválidos");
  }

  const user = await createUserService(req.body);
  console.log(user);
  if(user.error){
    return handleErrorServer(res, 500, "Error interno del servidor", user.error, JSON.stringify(user));
  }

  if (!user.data) {
    if (user.details && user.details.endsWith("ya registrado")) {
      return handleErrorClient(res, 409, user.details, user);
    }

    return handleErrorClient(res, 400, "Error al registar usuario",user);
  }

  return handleSuccess(res, 201, user.details, user.data);

}

export async function updateUser(req, res) {
    const { id } = req.params;

    const newData = req.body || null;

    if(!newData){
      return handleErrorClient(res, 400, "datos no proporcionados", null);
    }

     if (!id) {
      return res.status(400).json({message: "el id e sobligatorio"});
     }

     const result = idValidation.validate({id: id});
    if (result.error) {
      return res.status(400).json({message:"Id invalido"}, error);
    }

    var validationResult = integrityValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }

    validationResult = updateValidation.validate(newData);
    if (validationResult.error) {
      return handleErrorClient(res, 400, "datos invalidos");
    }  

    const editedUser = await updateUserService(id, newData);
    if(editedUser.error){
      return handleErrorServer(res, 500, "Error interno del sevidor", editedUser.details, JSON.stringify(editedUser));
    }

    if(editedUser.length <= 0){
      editedUser.error = true
      return handleErrorClient(res, 400, "Error deconocido",editedUser);
    }

    return handleSuccess(res, 200, "Usuario editado con exito", editedUser.details);
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "El id es obligatorio"});
  } 
  const result = idValidation.validate({id: id});
  if (result.error) {
    return handleErrorClient(res, 400, "id invalido");
  }
  if (id === req.user.id) {
    return handleErrorClient(res, 400, "No se puede eliminar a si mismo");
  }

  const user = await deleteUserService(id);

  if (user.error) {
    return handleErrorServer(res, 500, "Error interno del servidor", user.details, JSON.stringify(user));
  }
  if (user.length <= 0) {
    user.error = true;
    return handleErrorClient(res, 404, "Uusario no encontrado")
  }

  return handleSuccess(res, 200, "Usuario eliinado exitosamente", user);
}
*/
