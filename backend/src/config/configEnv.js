"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

//Conseguir la ruta del archivo
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath});

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DATABASE = process.env.DATABASE;
export const DB_PORT = process.env.DB_PORT || process.env.PORT;
export const DB_HOST = process.env.DB_HOST || process.env.HOST;


export const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_KEY = process.env.COOKIE_KEY;