import { EntitySchema } from "typeorm";

export const Asistencia = new EntitySchema({
  name: "Asistencia",
  tableName: "asistencias",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    fechaHora: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    clase: {
      target: "Clase",
      type: "many-to-one",
      joinColumn: { name: "claseId" },
      nullable: false,
      onDelete: "CASCADE",
    },
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default Asistencia;
