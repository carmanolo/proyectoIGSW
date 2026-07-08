"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT, DB_HOST, PORT } from "./configEnv.js";
import User from "../entities/user.entity.js";
import Evaluacion from "../entities/evaluaciones.entity.js";
import Clase from "../entities/clase.entity.js";
import Plan from "../entities/Plan.entity.js";
import Inscripcion from "../entities/Inscripcion.entity.js";
import Reserva from "../entities/reserva.entity.js";
import Vehiculo from "../entities/vehiculo.entity.js";
import Venta from "../entities/venta.entity.js";
import Asistencia from "../entities/asistencia.entity.js";
import Boleta from "../entities/Boleta.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${DB_HOST || HOST}`,
  port: parseInt(DB_PORT || PORT),
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Clase, Plan, Boleta, Inscripcion, Evaluacion, Venta, Reserva, Vehiculo, Asistencia],
  synchronize: true,
  logging: false,
});

 async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}

export default connectDB;