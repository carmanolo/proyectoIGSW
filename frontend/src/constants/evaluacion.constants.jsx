// Campos de evaluación
export const EVALUACION_CAMPOS = {
    ALUMNO: 'alumno',
    CALIFICACION_TEORICA: 'calificacion_teorica',
    RESULTADO: 'Resultado',
    COMENTARIO: 'comentario',
    COMPROBACION_DOCUMENTOS: 'comprobacion_documentos',
    COMPROBACION_AJUSTE_ESPEJO_ASIENTO: 'comprobacion_ajuste_espejo_asiento',
    COMPROBACION_SIN_CINTURON: 'comprobacion_sin_cinturon',
    COMPROBACION_ARRANQUE_MOTOR: 'comprobacion_arranque_motor',
    COMPROBACION_FRENO_ESTACIONAMIENTO: 'comprobacion_freno_estacionamiento',
    COMPROBACION_PUERTAS_CERRADAS: 'comprobacion_puertas_cerradas',
    INGRESO_OBSTACULIZAR: 'ingreso_obstaculizar',
    INGRESO_GENERAR_RIESGO: 'ingreso_generar_riesgo',
    CIRCULACION_EXCESO_VELOCIDAD: 'circulacion_exceso_velocidad',
    CIRCULACION_NO_RESPETAR_DISTANCIAS: 'circulacion_no_respetar_distancias',
    CAMBIO_SUBIR_FORZAR_GOLPEAR_CUNETA: 'cambio_subir_forzar_golpear_cuneta',
    CAMBIO_CAMBIO_BRUSCO_OBSTACULIZANDO: 'cambio_cambio_brusco_obstaculizando',
    CAMBIO_NO_SENYALIZAR_MAL: 'cambio_no_senyalizar_mal',
    CAMBIO_NO_QUITAR_SENAL: 'cambio_no_quitar_senal',
    VIRAJE_NO_SENYALIZAR_MAL: 'viraje_no_senyalizar_mal',
    VIRAJE_NO_QUITAR_SENAL: 'viraje_no_quitar_senal',
    VIRAJE_SUBIR_CUNETA: 'viraje_subir_cuneta',
    INTERSECCION_INGRESAR_OBSTACULIZANDO: 'interseccion_ingresar_obstaculizando',
    ADELANTAMIENTO_SOBREPASO_SOBREPASAR_POR_BERMA: 'adelantamiento_sobrepaso_sobrepasar_por_berma',
    ADELANTAMIENTO_SOBREPASO_PASO_PEATONAL_CRUCE_NO_REGULADOS: 'adelantamiento_sobrepaso_paso_peatonal_cruce_no_regulados',
    ADELANTAMIENTO_SOBREPASO_RIESGO_SENTIDO_CONTRARIO: 'adelantamiento_sobrepaso_riesgo_sentido_contrario',
    VIRAJE_U_NO_SENYALIZAR_MAL: 'viraje_u_no_senyalizar_mal',
    ESTACIONAMIENTO_SEPARACION: 'estacionamiento_separacion',
    ESTACIONAMIENTO_DOBLE_FILA: 'estacionamiento_doble_fila',
    ESTACIONAMIENTO_NO_FRENO_ESTACIONAMIENTO: 'estacionamiento_no_freno_estacionamiento',
    ESTACIONAMIENTO_GOLPEAR_CUNETA: 'estacionamiento_golpear_cuneta',
    ESTACIONAMIENTO_BAJAR_SIN_OBSERVAR: 'estacionamiento_bajar_sin_observar',
    DEMARCACIONES_SOBREPASAR_EJE_CALZADA: 'demarcaciones_sobrepasar_eje_calzada',
    DEMARCACIONES_NO_RESPETARLAS: 'demarcaciones_no_respetarlas',
    MANEJO_GOLPEAR_ALGO: 'manejo_golpear_algo',
    MANEJO_PERDER_CONTROL: 'manejo_perder_control',
    MANEJO_RELACION_MARCHAS_INADECUADAS: 'manejo_relacion_marchas_inadecuadas',
    MANEJO_CONFUSION_PEDALES: 'manejo_confusion_pedales',
    MANEJO_SOLTARLAS_MANOS: 'manejo_soltarlas_manos',
    MANEJO_SENTIDO_CONTRARIO: 'manejo_sentido_contrario',
    MANEJO_CONDUCIR_BRUSCA: 'manejo_conducir_brusca',
    MANEJO_MANIPULAR_RADIO_CELULAR: 'manejo_manipular_radio_celular',
    OBSERVACION_NO_OBSERVAR_TRAFICO: 'observacion_no_observar_trafico',
    SENAL_PARE_LUZ_ROJA: 'senal_pare_luz_roja',
    SENAL_CEDA_EL_PASO: 'senal_ceda_el_paso',
    SENAL_PROHIBICION_RESTRICCION: 'senal_prohibicion_restriccion',
    SENAL_NO_OBEDECER_CARABINEROS: 'senal_no_obedecer_carabineros',
    LUCES_NO_ENCENDER: 'luces_no_encender',
    PREFERENCIAS_PEATONES_CICLISTA_OTROS: 'preferencias_peatones_ciclista_otros',
    MANDOS_USAR_BOCINA_SIN_MOTIVO: 'mandos_usar_bocina_sin_motivo',
    MANDOS_NO_IDENTIFICAR_MANDOS: 'mandos_no_identificar_mandos',
};

export const RESULTADOS_MANEJO = [
    { value: 0, label: '0 - Sin faltas' },
    { value: 1, label: '1 - Falta leve' },
    { value: 2, label: '2 - Falta grave' },
    { value: 3, label: '3 - Reprobatorio' },
];

export const RESULTADOS_EVALUACION = [
    { value: 'evaluando', label: 'Pendiente' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'reprobado', label: 'Reprobado' },
];

export const EVALUACION_SECCIONES = [
    {
        title: 'Comprobaciones',
        fields: [
            { name: EVALUACION_CAMPOS.COMPROBACION_DOCUMENTOS, label: 'Comprobación de documentos' },
            { name: EVALUACION_CAMPOS.COMPROBACION_AJUSTE_ESPEJO_ASIENTO, label: 'Ajuste espejo asiento' },
            { name: EVALUACION_CAMPOS.COMPROBACION_SIN_CINTURON, label: 'Sin cinturón' },
            { name: EVALUACION_CAMPOS.COMPROBACION_ARRANQUE_MOTOR, label: 'Arranque de motor' },
            { name: EVALUACION_CAMPOS.COMPROBACION_FRENO_ESTACIONAMIENTO, label: 'Freno de estacionamiento' },
            { name: EVALUACION_CAMPOS.COMPROBACION_PUERTAS_CERRADAS, label: 'Puertas cerradas' },
        ],
    },
    {
        title: 'Ingreso',
        fields: [
            { name: EVALUACION_CAMPOS.INGRESO_OBSTACULIZAR, label: 'Ingresar obstaculizando' },
            { name: EVALUACION_CAMPOS.INGRESO_GENERAR_RIESGO, label: 'Generar riesgo' },
        ],
    },
    {
        title: 'Circulación',
        fields: [
            { name: EVALUACION_CAMPOS.CIRCULACION_EXCESO_VELOCIDAD, label: 'Exceso de velocidad' },
            { name: EVALUACION_CAMPOS.CIRCULACION_NO_RESPETAR_DISTANCIAS, label: 'No respetar distancias' },
        ],
    },
    {
        title: 'Cambio',
        fields: [
            { name: EVALUACION_CAMPOS.CAMBIO_SUBIR_FORZAR_GOLPEAR_CUNETA, label: 'Subir/forzar/golpear cuneta' },
            { name: EVALUACION_CAMPOS.CAMBIO_CAMBIO_BRUSCO_OBSTACULIZANDO, label: 'Cambio brusco obstaculizando' },
            { name: EVALUACION_CAMPOS.CAMBIO_NO_SENYALIZAR_MAL, label: 'No señalizar bien' },
            { name: EVALUACION_CAMPOS.CAMBIO_NO_QUITAR_SENAL, label: 'No quitar señal' },
        ],
    },
    {
        title: 'Viraje',
        fields: [
            { name: EVALUACION_CAMPOS.VIRAJE_NO_SENYALIZAR_MAL, label: 'No señalizar bien' },
            { name: EVALUACION_CAMPOS.VIRAJE_NO_QUITAR_SENAL, label: 'No quitar señal' },
            { name: EVALUACION_CAMPOS.VIRAJE_SUBIR_CUNETA, label: 'Subir cuneta' },
        ],
    },
    {
        title: 'Intersección y adelantamiento',
        fields: [
            { name: EVALUACION_CAMPOS.INTERSECCION_INGRESAR_OBSTACULIZANDO, label: 'Ingresar obstaculizando' },
            { name: EVALUACION_CAMPOS.ADELANTAMIENTO_SOBREPASO_SOBREPASAR_POR_BERMA, label: 'Sobrepasar por berma' },
            { name: EVALUACION_CAMPOS.ADELANTAMIENTO_SOBREPASO_PASO_PEATONAL_CRUCE_NO_REGULADOS, label: 'Paso peatonal/cruce no regulados' },
            { name: EVALUACION_CAMPOS.ADELANTAMIENTO_SOBREPASO_RIESGO_SENTIDO_CONTRARIO, label: 'Riesgo sentido contrario' },
        ],
    },
    {
        title: 'Estacionamiento',
        fields: [
            { name: EVALUACION_CAMPOS.ESTACIONAMIENTO_SEPARACION, label: 'Separación' },
            { name: EVALUACION_CAMPOS.ESTACIONAMIENTO_DOBLE_FILA, label: 'Doble fila' },
            { name: EVALUACION_CAMPOS.ESTACIONAMIENTO_NO_FRENO_ESTACIONAMIENTO, label: 'Sin freno de estacionamiento' },
            { name: EVALUACION_CAMPOS.ESTACIONAMIENTO_GOLPEAR_CUNETA, label: 'Golpear cuneta' },
            { name: EVALUACION_CAMPOS.ESTACIONAMIENTO_BAJAR_SIN_OBSERVAR, label: 'Bajar sin observar' },
        ],
    },
    {
        title: 'Demarcaciones',
        fields: [
            { name: EVALUACION_CAMPOS.DEMARCACIONES_SOBREPASAR_EJE_CALZADA, label: 'Sobrepasar eje calzada' },
            { name: EVALUACION_CAMPOS.DEMARCACIONES_NO_RESPETARLAS, label: 'No respetarlas' },
        ],
    },
    {
        title: 'Manejo',
        fields: [
            { name: EVALUACION_CAMPOS.MANEJO_GOLPEAR_ALGO, label: 'Golpear algo' },
            { name: EVALUACION_CAMPOS.MANEJO_PERDER_CONTROL, label: 'Perder control' },
            { name: EVALUACION_CAMPOS.MANEJO_RELACION_MARCHAS_INADECUADAS, label: 'Relación de marchas inadecuadas' },
            { name: EVALUACION_CAMPOS.MANEJO_CONFUSION_PEDALES, label: 'Confusión de pedales' },
            { name: EVALUACION_CAMPOS.MANEJO_SOLTARLAS_MANOS, label: 'Soltar las manos' },
            { name: EVALUACION_CAMPOS.MANEJO_SENTIDO_CONTRARIO, label: 'Sentido contrario' },
            { name: EVALUACION_CAMPOS.MANEJO_CONDUCIR_BRUSCA, label: 'Conducir brusca' },
            { name: EVALUACION_CAMPOS.MANEJO_MANIPULAR_RADIO_CELULAR, label: 'Manipular radio/celular' },
        ],
    },
    {
        title: 'Señales y mandos',
        fields: [
            { name: EVALUACION_CAMPOS.OBSERVACION_NO_OBSERVAR_TRAFICO, label: 'No observar tráfico' },
            { name: EVALUACION_CAMPOS.SENAL_PARE_LUZ_ROJA, label: 'Señal pare / luz roja' },
            { name: EVALUACION_CAMPOS.SENAL_CEDA_EL_PASO, label: 'Señal ceda el paso' },
            { name: EVALUACION_CAMPOS.SENAL_PROHIBICION_RESTRICCION, label: 'Señal prohibición/restricción' },
            { name: EVALUACION_CAMPOS.SENAL_NO_OBEDECER_CARABINEROS, label: 'No obedecer carabineros' },
            { name: EVALUACION_CAMPOS.LUCES_NO_ENCENDER, label: 'Luces no encender' },
            { name: EVALUACION_CAMPOS.PREFERENCIAS_PEATONES_CICLISTA_OTROS, label: 'Preferencias de peatones/ciclista/otros' },
            { name: EVALUACION_CAMPOS.MANDOS_USAR_BOCINA_SIN_MOTIVO, label: 'Usar bocina sin motivo' },
            { name: EVALUACION_CAMPOS.MANDOS_NO_IDENTIFICAR_MANDOS, label: 'No identificar mandos' },
        ],
    },
];

export const NUMERIC_EVALUATION_FIELDS = EVALUACION_SECCIONES.flatMap((section) => section.fields.map((field) => field.name));

// Rangos de calificación teórica
export const MIN_CALIFICACION_TEORICA = 0;
export const MAX_CALIFICACION_TEORICA = 38;
