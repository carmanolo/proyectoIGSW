import { EntitySchema } from "typeorm";

export const Vehiculo = new EntitySchema({
  name: "Vehiculo",
  tableName: "vehiculos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    patente: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    transmision: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "disponible",
    },
  },
});

export default Vehiculo;
