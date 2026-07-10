"use strict";
import { EntitySchema } from "typeorm";

export const PagoDeuda = new EntitySchema({
  name: "PagoDeuda",
  tableName: "pagos_deudas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    monto: {
      type: "int",
      nullable: false,
    },
    comprobante: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
    },
    tipo_deuda: {
      type: "enum",
      enum: ["inscripcion", "venta"],
      nullable: false,
    },
    deuda_id: {
      type: "int",
      nullable: false,
    },
    fecha_solicitud: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    fecha_resolucion: {
      type: "timestamp",
      nullable: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "user_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default PagoDeuda;
