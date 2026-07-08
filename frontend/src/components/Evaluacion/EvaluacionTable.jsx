import { RESULTADOS_EVALUACION } from "../../constants/evaluacion.constants.jsx";

const countPracticeScores = (evaluacion) => {
    const counts = { sinFaltas: 0, leves: 0, graves: 0, reprobatorios: 0 };
    const practicePrefixes = [
        "comprobacion_",
        "ingreso_",
        "circulacion_",
        "cambio_",
        "viraje_",
        "interseccion_",
        "adelantamiento_",
        "estacionamiento_",
        "demarcaciones_",
        "manejo_",
        "observacion_",
        "senal_",
        "luces_",
        "preferencias_",
        "mandos_",
    ];

    Object.entries(evaluacion).forEach(([field, value]) => {
        if (!practicePrefixes.some((prefix) => field.startsWith(prefix))) {
            return;
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) {
            return;
        }

        if (numericValue === 0) counts.sinFaltas += 1;
        if (numericValue === 1) counts.leves += 1;
        if (numericValue === 2) counts.graves += 1;
        if (numericValue === 3) counts.reprobatorios += 1;
    });

    return counts;
};

export const EvaluacionTable = ({
    data,
    onEdit,
    onDelete,
    isLoading = false,
}) => {
    const getResultadoValue = (evaluacion) => {
        return (
            evaluacion?.Resultado ||
            evaluacion?.resultado ||
            evaluacion?.estado ||
            evaluacion?.status ||
            "evaluando"
        );
    };

    const getResultadoLabel = (value) => {
        const normalized = String(value || "").toLowerCase();
        return RESULTADOS_EVALUACION.find((r) => r.value === normalized)?.label || value || "N/A";
    };

    const getEstadoClass = (value) => {
        const normalized = String(value || "").toLowerCase();
        if (normalized === "aprobado") return "badge-success";
        if (normalized === "reprobado") return "badge-error";
        return "badge-warning";
    };

    if (!data || data.length === 0) {
        return (
            <div className="alert alert-info">
                <span>No hay evaluaciones registradas</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Tipo</th>
                        <th>Detalle</th>
                        <th>Estado</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((evaluacion) => {
                        const tipo = evaluacion.tipo_evaluacion || evaluacion.tipo || "practica";
                        const detalle = tipo === "teorica"
                            ? `${evaluacion.calificacion_teorica ?? 0}/${38}`
                            : (() => {
                                const counts = countPracticeScores(evaluacion);
                                return `Sin faltas: ${counts.sinFaltas}, Leves: ${counts.leves}, Graves: ${counts.graves}, Reprobatorios: ${counts.reprobatorios}`;
                            })();
                        const resultado = String(getResultadoValue(evaluacion) || "").toLowerCase();

                        return (
                            <tr key={evaluacion.id_evaluacion}>
                                <td className="font-semibold">{evaluacion.alumno}</td>
                                <td>{tipo === "teorica" ? "Teórica" : "Práctica"}</td>
                                <td>{detalle}</td>
                                <td>
                                    <span className={`badge badge-lg ${getEstadoClass(resultado)}`}>
                                        {getResultadoLabel(resultado)}
                                    </span>
                                </td>
                                <td>{evaluacion.comentario}</td>
                                <td className="space-x-2">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(evaluacion)}
                                            className="btn btn-sm btn-info"
                                            disabled={isLoading}
                                        >
                                            Editar
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(evaluacion.id_evaluacion)}
                                            className="btn btn-sm btn-error"
                                            disabled={isLoading}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
