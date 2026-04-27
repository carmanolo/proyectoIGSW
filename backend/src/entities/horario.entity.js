import { EntitySchema } from "typeorm";

export const Horario = new EntitySchema({
  name: "Horario",
  tableName: "horarios",
  columns: {
    id_horario: {
      primary: true,
      type: "int",
      generated: true,
    },
    hora_inicio: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    hora_fin: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    dia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
});
