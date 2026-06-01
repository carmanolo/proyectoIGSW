import { AppDataSource } from "./config/configDb.js";
import { getReservasUsuarioSer } from "./services/reserva.service.js";

async function test() {
    try {
        await AppDataSource.initialize();
        console.log("DB initialized");
        const res = await getReservasUsuarioSer("undefined");
        console.log("Result for undefined:", res);
        
        const res2 = await getReservasUsuarioSer(1);
        console.log("Result for 1:", res2);
        
        process.exit(0);
    } catch(e) {
        console.error("Fatal error:", e);
        process.exit(1);
    }
}
test();
