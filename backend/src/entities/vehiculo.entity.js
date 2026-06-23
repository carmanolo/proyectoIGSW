import { EntitySchema } from "typeorm";

export const Vehiculo = new EntitySchema({
  name: "Vehiculo",
  tableName: "vehiculos",
  columns: {
    id_auto: {
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
  relations:{
    clase:{
      type: "one-to-many",
      target: "Clase",
      inverseSide: "vehiculos",
    }
  }
});

export default Vehiculo;
