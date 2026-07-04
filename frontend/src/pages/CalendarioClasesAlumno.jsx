import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetClase } from "@hooks/Clase/useGetClase.jsx"
import { useGetTeacherList } from "../hooks/Listas/useGetTeacherList.jsx";
import { useGetVehiculoList } from "../hooks/Listas/useGetVehiculoList.jsx";
import { useCalendarioClases } from "../hooks/Calendario/useCalendarioClases.jsx";
import { CalendarioMensual } from "../components/Calendario/CalendarioMensual.jsx";

const ICONO_TIPO = { teorica: "📄", practica: "🚗" };

const mostrarDetalleClase = (clase) =>{
    Swal.fire({
        title: `${ICONO_TIPO[clase.tipo] || "🍭"} ${clase.descripcion}`,
        theme: "light",
        html: `
            <p><b>Tipo:</b> ${String(clase.tipo).toUpperCase()}</p>
            <p><b>Horario: </b> ${clase.hora_inicio} - ${clase.hora_fin}</p>
            <p><b>Estado:</b> ${String(clase.estado_clase).toUpperCase()}</p>
            <p><b>Profesor:</b> ${clase.teacherObject?.name || "Sin asignar"}</p>
            ${clase.tipo === "practica"
                ? `<p><b>Patente vehículo: </b></p> ${clase.carObject?.patente || "sin asignar"}`
                : ""
            }
        `,
    });
};

const CalendarioClasesAlumno = ()=> {
    const [claseData, setClaseData] = useState([]);
    const [Clases, fetchClase] = useGetClase(claseData, setClaseData);

    const [profesores, setProfesores] = useState([]);
    const [teacherList, fetchTeacherList] = useGetTeacherList(profesores, setProfesores);

    const [vehiculos, setVehiculoList] = useState([]);
    const [vehiculoList, fetchVehiculoList] = useGetVehiculoList(vehiculos, setVehiculoList);

    const hoy = new Date();
    const [mesActual, setMesActual] = useState(hoy.getMonth());
    const [anioActual, setAnioActual] = useState(hoy.getFullYear());

    const { eventosPorFecha } = useCalendarioClases(Clases, teacherList, vehiculoList);

    useEffect(() => {
        if (typeof fetchClase === "function") fetchClase();
        if (typeof fetchTeacherList === "function") fetchTeacherList();
        if (typeof fetchVehiculoList === "function") fetchVehiculoList();
    }, []);

    const cambiarMes= (delta) =>{
        let nuevoMes= mesActual +delta;
        let nuevoAnio = anioActual;
        if(nuevoMes < 0){
            nuevoMes = 11;
            nuevoAnio -=1
        } else if (nuevoMes > 11){
            nuevoMes=0;
            nuevoAnio +=1;
        }
        setMesActual(nuevoMes);
        setAnioActual(nuevoAnio);
    };

    const irAhoy = () => {
        setMesActual(hoy.getMonth());
        setAnioActual(hoy.getFullYear());
    };

    return (
        <div className="calendario-clases-page p-3">
            <h1 className="text-xl font-bold mb-3">Proximas clases</h1>
            <CalendarioMensual
                anio={anioActual}
                mes={mesActual}
                onCambiarMes={cambiarMes}
                onIrHoy={irAhoy}
                eventosPorFecha={eventosPorFecha}
                onClickEvento={mostrarDetalleClase}
            />
        </div>
    );
};

export default CalendarioClasesAlumno;