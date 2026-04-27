import { EntitySchema } from "typeorm";

export const vehiculo = new EntitySchema({
  type: "car",
  tableName: "cars",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    patente: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    typo: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    p_asignado: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    garantia: {
      type: "boolean",
      createDate: true,
      nullable: false
    },
    actualizado: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default Car;