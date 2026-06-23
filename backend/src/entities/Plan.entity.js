import { EntitySchema } from "typeorm";

export const Plan = new EntitySchema({
  name: "Plan",
  tableName: "planes",
  columns: {
    id_plan: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
      unique: true,
    },
    costo: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    duracion_semanas: {
      type: "int",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    tipo: {
      type: "enum",
      enum: ["teorico", "practico", "completo"],
      default: "completo",
    },
    clases_totales: {
      type: "int",
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["activo", "inactivo"],
      default: "activo",
    },
    fecha_creacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    fecha_actualizacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
  },
});
export default Plan;