import "dotenv/config";
import express from "express";
import morgan from "morgan";
import connectDB from "../src/config/configDb.js";
import routerApi from "../src/routes/index.routes.js";
import { PORT,HOST } from "./config/configEnv.js";
import { iniciarUsuarios } from "./config/initialSetup.js";

async function setupServer() {
  //Crea la instancia de express
  const app = express();
  app.disable("x-powered-by");

  //Avisa a express que use JSON
  app.use(express.json());

  // Configura el middleware de morgan para registrar las peticiones HTTP
  app.use(morgan("dev"));

  // Configura las rutas de la API
  app.use("/api", routerApi);

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${HOST}:${PORT}`);
  });
}

async function setupAPI() {
  try {
    //Conectar la base de datos
    await connectDB();
    //Crea los usuarios iniciales
    await iniciarUsuarios();
    //Configura el srvidor
    await setupServer();
  } catch (error) {
    console.error("Error en index.js -> setupAPI(): ", error);
  }
  
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI(): ", error));
/*const app = express();
app.use(express.json());
app.use(morgan("dev"));
// Ruta principal de bienvenida
app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi API REST con TypeORM!");
});

// Inicializa la conexión a la base de datos
await connectDB()
  .then(() => {
    // Carga todas las rutas de la aplicación
    routerApi(app);

    // Levanta el servidor Express
    const PORT = process.env.PORT ;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });*/
