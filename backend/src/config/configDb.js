"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT, DB_HOST, PORT } from "./configEnv.js";
import User from "../entities/user.entity.js";
import Clase from "../entities/clase.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${DB_HOST || HOST}`,
  port: parseInt(DB_PORT || PORT),
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Clase],
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