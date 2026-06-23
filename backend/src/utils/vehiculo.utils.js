export const procesarVehiculos = (vehiculos) => {
    const VEHICULOS_POR_DEFECTO = [];
    if (!Array.isArray(vehiculos)) {
        console.error("¡Los vehiculos deben ser un arreglo!");
        return VEHICULOS_POR_DEFECTO;
    }
    const vehiculosProcesados = vehiculos.map((vehiculo) => {
        return String(vehiculo.patente || "CR-7C-R7"); 
    });
    return vehiculosProcesados;    
}