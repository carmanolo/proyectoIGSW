import { EntitySchema } from "typeorm";

export const Reserva = new EntitySchema({
  name: "Reserva",
  tableName: "reservas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    tipo: {
      type: "varchar",
      length: 50,
      default: "clase_regular", // clase_regular, pre_evaluacion
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "activa", // activa, completada, cancelada
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
    },
    vehiculo: {
      target: "Vehiculo",
      type: "many-to-one",
      joinColumn: { name: "vehiculoId" },
      nullable: false,
      onDelete: "RESTRICT",
    },
    clase: {
      target: "Clase",
      type: "many-to-one",
      joinColumn: { name: "claseId" },
      nullable: false,
      onDelete: "RESTRICT",
    },
  },
});

export default Reserva;
