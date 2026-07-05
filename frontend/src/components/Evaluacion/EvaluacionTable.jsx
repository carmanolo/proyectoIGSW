import { RESULTADOS_EVALUACION } from "../../constants/evaluacion.constants.jsx";

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
                        <th>Calificación Teórica</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((evaluacion) => (
                        <tr key={evaluacion.id_evaluacion}>
                            <td className="font-semibold">{evaluacion.alumno}</td>
                            <td>
                                <span className="badge badge-lg">
                                    {evaluacion.calificacion_teorica ?? 0}/{38}
                                </span>
                            </td>
                            <td>
                                {(() => {
                                    const resultado = String(getResultadoValue(evaluacion) || "").toLowerCase();
                                    return (
                                        <span className={`badge badge-lg ${getEstadoClass(resultado)}`}>
                                            {getResultadoLabel(resultado)}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td className="space-x-2">
                                <button
                                    onClick={() => onEdit(evaluacion)}
                                    className="btn btn-sm btn-info"
                                    disabled={isLoading}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(evaluacion.id_evaluacion)}
                                    className="btn btn-sm btn-error"
                                    disabled={isLoading}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
