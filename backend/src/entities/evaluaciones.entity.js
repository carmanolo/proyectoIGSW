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
        type: "varchar",
        length: 255,
        nullable: true,
    },
    resultado_manejo :{
        type: "enum",
        enum: [0, 1, 2, 3], // 0: sin faltas, 1: leve, 2: grave, 3: reprobatoria
        nullable: true,
    },
    resultado_manejo :{
        type: "enum",
        enum: [0, 1, 2, 3], // 0: sin faltas, 1: leve, 2: grave, 3: reprobatoria
        nullable: true,
    },
    resultado_manejo :{
        type: "enum",
        enum: [0, 1, 2, 3], // 0: sin faltas, 1: leve, 2: grave, 3: reprobatoria
        nullable: true,
    },
    resultado_manejo :{
        type: "enum",
        enum: [0, 1, 2, 3], // 0: sin faltas, 1: leve, 2: grave, 3: reprobatoria
        nullable: true,
    },
    resultado_manejo :{
        type: "enum",
        enum: [0, 1, 2, 3], // 0: sin faltas, 1: leve, 2: grave, 3: reprobatoria
        nullable: true,
    },
    Resultado : {
        type: "enum",
        enum: ["evaluando", "aprobado", "reprobado"],
        nullable: false,
    },
    comentario : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
  },
});

export default Evaluacion;