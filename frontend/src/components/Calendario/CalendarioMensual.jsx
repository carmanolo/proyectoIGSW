import { MESES, DIAS_SEMANA, generalDiasDelMes, obtenerFechaKey, esMismodia } from "../../utils/calendarUtils";
const ICONO_TIPO={
    teorica: "📄",
    practica: "🚗",
};

export const CalendarioMensual = ({ anio, mes, onCambiarMes, onIrHoy, eventosPorFecha, onClickEvento}) => {
    const celdas = generalDiasDelMes(anio, mes);
    const hoy = new Date();

    return (
        <div className="rounded-box border border-base-content/10 bg-base-100 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-base-content/10">
                <button className="btn btn-sm" onClick={onIrHoy}>Hoy</button>
                <div className="flex items-center gap2">
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={() => onCambiarMes(-1)}> ⬅️ </button>
                    <span className="font-semibold text-lg">{MESES[mes]} {anio}</span>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={() => onCambiarMes(1)}> ➡️ </button>
                </div>
                <div className="w-16"/>
            </div>

            <section className="grid grid-cols-7 text-center text-xs font-semibold text-base-content/60 border-b border-base-content/10">
                {DIAS_SEMANA.map((d) => (
                    <div key={d} className="py-2">{d}</div>
                ))}
            </section>

            <div className="grid grid-cols-7">
                {celdas.map(({dia, fecha, delMesActual}, idx)=> {
                    const key = obtenerFechaKey(fecha);
                    const eventos = eventosPorFecha[key] || [];
                    const esHoy = esMismodia(fecha, hoy);

                    return (
                        <div
                            key={idx}
                            className={`min-h-24 border-b border-r border-base-content/10 p-1 ${delMesActual ? "": "bg-base-200/40"}`}
                        >
                            <div className={`text-xs mb-1 ${esHoy ? "badge badge-primary" : delMesActual ? "" : "text-base-content/40"}`}>
                                {dia}
                            </div>
                            <div className="flex flex-col gap-1">
                                {eventos.map((clase) => (
                                    <button
                                        key={clase.id_clase}
                                        onClick={() => onClickEvento(clase)}
                                        className={`text-left text-xs truncate rounded px-1 py-0.5 text-white ${
                                            clase.tipo === "practica" ? "bg-info" : "bg-success"
                                        }`}
                                        title={clase.descripcion}
                                    >
                                        {ICONO_TIPO[clase.tipo] || "📌"} {clase.hora_inicio} {clase.descripcion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarioMensual;

