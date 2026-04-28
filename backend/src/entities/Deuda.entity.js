import { EntitySchema } from "typeorm";

export const Deuda = new EntitySchema({
  name: "Deuda",
  tableName: "deudas",
  columns: {
    id_deuda: {
      primary: true,
      type: "int",
      generated: true,
    },
    monto: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    monto_pagado: {
      type: "decimal",
      precision: 10,
      scale: 2,
      default: 0,
      nullable: false,
    },
    fecha_vencimiento: {
      type: "date",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "enum",
      enum: ["pendiente", "pagada", "vencida" ],
      default: "pendiente",
      nullable: false,
    },
    fecha_creacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    fecha_actualizacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
    fecha_pago: {
      type: "timestamp",
      nullable: true,
    },
  },
});

export default Deuda;