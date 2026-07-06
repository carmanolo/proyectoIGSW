export const procesarVehiculos = (vehiculos) => {
    const DEFAULT_PATENTE = "CR-7C-R7";
    const VEHICULOS_POR_DEFECTO = [];
    if (!Array.isArray(vehiculos)) {
        console.error("¡Los vehiculos deben ser un arreglo!");
        return VEHICULOS_POR_DEFECTO;
    }
    const vehiculosProcesados = vehiculos.map((vehiculo) => {
        return String(`${vehiculo?.id_auto || 0}. ${vehiculo?.patente || DEFAULT_PATENTE}` || DEFAULT_PATENTE); 
    });
    return vehiculosProcesados;    
}