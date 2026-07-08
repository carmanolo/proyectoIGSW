import { useMemo } from "react";
import { obtenerFechaKey } from "../../utils/calendarUtils.js";
import DisplayTeacher from "../../classes/DisplayTeacher.js";
import DisplayCar from "../../classes/DisplayCar.js";

export function useCalendarioClases(clases, teacherList, vehiculoList) {
    const eventosPorFecha = useMemo(() => {
        const agrupado = {}
        if(!Array.isArray(clases)) return agrupado;

        for (const clase of clases){
            const key = obtenerFechaKey(clase.fecha_clase);
            if(!key) continue;

            const currentTeacher = new DisplayTeacher(teacherList, clase.id_profesor || 0);
            const currentCar = new DisplayCar(vehiculoList, clase.id_auto || 0);
            const claseEnriquecida = Object.assign({}, clase, {
                teacherObject: currentTeacher,
                carObject: currentCar,
            });

            //console.log(carObject);

            if(!agrupado[key]) agrupado[key] =[];
            agrupado[key].push(claseEnriquecida);

        }

        return agrupado;
    }, [clases, teacherList, vehiculoList]);

    return {eventosPorFecha};
}