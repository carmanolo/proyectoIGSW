import { EntitySchema } from "typeorm";

export const Evaluacion = new EntitySchema({
  name: "Evaluacion",
  tableName: "evaluaciones",
  columns: {
    id_evaluacion: {
        primary: true,
        type: "int",
        generated: true,
    },
    alumno:{
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_1 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_2 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_3 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_4 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_5 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    calificacion_6 : {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    profesor: {
        type: "varchar",
        length: 255,
        nullable: false,
    },
    opinion: {
        type: "varchar",
        length: 255,
        nullable: false,
    },
  },
});

export default Evaluacion;