import { EntitySchema } from "typeorm";

export const Evaluacion = new EntitySchema({
  name: "Evaluacion",
  tableName: "evaluaciones",
  columns: {
    id_evaluacion: {
        primary: true,
        type: "int",
        generated: "increment",
    },
    alumno:{
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_teorica : {
        type: "int",
        unsigned: true,
        nullable: true,
    },
    tipo_evaluacion: {
      type: "enum",
      enum: ["practica", "teorica"],
      nullable: false,
      default: "practica",
    },
    Resultado : {
        type: "enum",
        enum: ["evaluando", "aprobado", "reprobado"],
        nullable: false,
    },
    comentario : {
        type: "text",
        nullable: false,
        default: "",
    },
    comprobacion_documentos: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    comprobacion_ajuste_espejo_asiento: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    comprobacion_sin_cinturon: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    comprobacion_arranque_motor: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    comprobacion_freno_estacionamiento: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    comprobacion_puertas_cerradas: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    ingreso_obstaculizar: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    ingreso_generar_riesgo: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    circulacion_exceso_velocidad: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    circulacion_no_respetar_distancias: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    cambio_subir_forzar_golpear_cuneta: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    cambio_cambio_brusco_obstaculizando: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    cambio_no_senyalizar_mal: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    cambio_no_quitar_senal: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    viraje_no_senyalizar_mal: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    viraje_no_quitar_senal: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    viraje_subir_cuneta: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    interseccion_ingresar_obstaculizando: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    adel_sobrepaso_sobrepasar_por_berma: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    adelSbrepsoPasoPeatonalCruzNoRegldos: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    adelSobrepasoRiesgoSentidoContrario: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    viraje_u_no_senyalizar_mal: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    estacionamiento_separacion: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    estacionamiento_doble_fila: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    estacionamiento_no_frenoEstacionamiento: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    estacionamiento_golpear_cuneta: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    estacionamiento_bajar_sin_observar: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    demarcaciones_sobrepasar_eje_calzada: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    demarcaciones_no_respetarlas: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_golpear_algo: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_perder_control: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_relacion_marchas_inadecuadas: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_confusion_pedales: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_soltarlas_manos: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_sentido_contrario: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_conducir_brusca: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    manejo_manipular_radio_celular: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    observacion_no_observar_trafico: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    senal_pare_luz_roja: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    senal_ceda_el_paso: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    senal_prohibicion_restriccion: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    senal_no_obedecer_carabineros: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    luces_no_encender: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    preferencias_peatones_ciclista_otros: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    mandos_usar_bocina_sin_motivo: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
    mandos_no_identificar_mandos: {
      type: "enum",
      enum: [0, 1, 2, 3],
      nullable: true,
    },
  },
  relations: {
    alumno_relacion: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "alumno_id" },
      nullable: true,
      eager: false,
    },
/*    profesor_relacion: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "profesor_id" },
      nullable: true,
      eager: false,
    },*/
  },
  checks: [
    { 
      expression: "calificacion_teorica >= 0 AND calificacion_teorica <= 38",
    },
  ],
});

export default Evaluacion;