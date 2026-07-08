import { useEffect, useState } from "react";
import {
    EVALUACION_CAMPOS,
    RESULTADOS_MANEJO,
    RESULTADOS_EVALUACION,
    EVALUACION_TIPOS,
    MAX_CALIFICACION_TEORICA,
    MIN_CALIFICACION_TEORICA,
    EVALUACION_SECCIONES,
    NUMERIC_EVALUATION_FIELDS,
} from "../../constants/evaluacion.constants.jsx";

const getInitialFormData = (evaluacion) => {
    const base = {
        [EVALUACION_CAMPOS.ALUMNO]: "",
        [EVALUACION_CAMPOS.CALIFICACION_TEORICA]: 0,
        [EVALUACION_CAMPOS.TIPO_EVALUACION]: "practica",
        [EVALUACION_CAMPOS.RESULTADO]: "evaluando",
        [EVALUACION_CAMPOS.COMENTARIO]: "",
    };

    NUMERIC_EVALUATION_FIELDS.forEach((field) => {
        base[field] = 0;
    });

    if (!evaluacion) {
        return base;
    }

    return {
        ...base,
        ...evaluacion,
        [EVALUACION_CAMPOS.RESULTADO]: evaluacion.Resultado ?? evaluacion.resultado ?? "evaluando",
    };
};

export const EvaluacionForm = ({ evaluacion, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState(getInitialFormData(evaluacion));

    useEffect(() => {
        setFormData(getInitialFormData(evaluacion));
    }, [evaluacion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === EVALUACION_CAMPOS.CALIFICACION_TEORICA
                ? parseInt(value)
                : NUMERIC_EVALUATION_FIELDS.includes(name)
                    ? parseInt(value)
                    : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-box">
            <div className="modal-header">
                <h3 className="font-bold text-lg">
                    {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {/* Alumno */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nombre del Alumno *</span>
                    </label>
                    <input
                        type="text"
                        name={EVALUACION_CAMPOS.ALUMNO}
                        value={formData[EVALUACION_CAMPOS.ALUMNO]}
                        onChange={handleChange}
                        placeholder="Ingrese nombre del alumno"
                        className="input input-bordered"
                        required
                    />
                </div>

                {/* Tipo de evaluación */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Tipo de evaluación *</span>
                    </label>
                    <select
                        name={EVALUACION_CAMPOS.TIPO_EVALUACION}
                        value={formData[EVALUACION_CAMPOS.TIPO_EVALUACION]}
                        onChange={handleChange}
                        className="select select-bordered"
                        required
                    >
                        {EVALUACION_TIPOS.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </div>

                {formData[EVALUACION_CAMPOS.TIPO_EVALUACION] === "teorica" && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Calificación Teórica (0-{MAX_CALIFICACION_TEORICA}) *
                            </span>
                        </label>
                        <input
                            type="number"
                            name={EVALUACION_CAMPOS.CALIFICACION_TEORICA}
                            value={formData[EVALUACION_CAMPOS.CALIFICACION_TEORICA]}
                            onChange={handleChange}
                            min={MIN_CALIFICACION_TEORICA}
                            max={MAX_CALIFICACION_TEORICA}
                            className="input input-bordered"
                            required
                        />
                    </div>
                )}

                {/* Campos de evaluación */}
                <div className="space-y-4">
                    {EVALUACION_SECCIONES.map((section) => {
                        const visibleFields = section.fields.filter((field) => {
                            const isPracticeField = field.name.startsWith("comprobacion_") || field.name.startsWith("ingreso_") || field.name.startsWith("circulacion_") || field.name.startsWith("cambio_") || field.name.startsWith("viraje_") || field.name.startsWith("interseccion_") || field.name.startsWith("adelantamiento_") || field.name.startsWith("estacionamiento_") || field.name.startsWith("demarcaciones_") || field.name.startsWith("manejo_") || field.name.startsWith("observacion_") || field.name.startsWith("senal_") || field.name.startsWith("luces_") || field.name.startsWith("preferencias_") || field.name.startsWith("mandos_");
                            return formData[EVALUACION_CAMPOS.TIPO_EVALUACION] === "practica"
                                ? isPracticeField
                                : !isPracticeField;
                        });

                        if (!visibleFields.length) {
                            return null;
                        }

                        return (
                            <div key={section.title} className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">{section.title}</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {visibleFields.map((field) => (
                                        <div key={field.name}>
                                            <label className="label py-1">
                                                <span className="label-text-alt">{field.label}</span>
                                            </label>
                                            <select
                                                name={field.name}
                                                value={formData[field.name] ?? 0}
                                                onChange={handleChange}
                                                className="select select-bordered select-sm w-full"
                                            >
                                                {RESULTADOS_MANEJO.map((resultado) => (
                                                    <option key={resultado.value} value={resultado.value}>
                                                        {resultado.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Estado de la evaluación */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Estado de la evaluación *</span>
                    </label>
                    <select
                        name={EVALUACION_CAMPOS.RESULTADO}
                        value={formData[EVALUACION_CAMPOS.RESULTADO]}
                        onChange={handleChange}
                        className="select select-bordered"
                        required
                    >
                        {RESULTADOS_EVALUACION.map((resultado) => (
                            <option key={resultado.value} value={resultado.value}>
                                {resultado.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Comentario */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Comentario</span>
                    </label>
                    <textarea
                        name={EVALUACION_CAMPOS.COMENTARIO}
                        value={formData[EVALUACION_CAMPOS.COMENTARIO]}
                        onChange={handleChange}
                        placeholder="Observaciones sobre la evaluación"
                        className="textarea textarea-bordered"
                        rows="3"
                    ></textarea>
                </div>

                {/* Botones */}
                <div className="modal-action gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};
