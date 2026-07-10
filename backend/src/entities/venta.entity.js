"use strict";
import { EntitySchema } from "typeorm";

export const Venta = new EntitySchema({
name: "Venta",
tableName: "ventas",
columns: {
    id: {
    primary: true,
    type: "int",
    generated: "increment",
    },
    cantidad: {
    type: "int",
    nullable: false,
    },
    fecha_venta: {
    type: "timestamp",
    createDate: true,
    default: () => "CURRENT_TIMESTAMP",
    },
    monto_total: {
    type: "int",
    nullable: false,
    default: 0,
    },
    monto_pagado: {
    type: "int",
    nullable: false,
    default: 0,
    },
    fecha_vencimiento: {
    type: "date",
    nullable: true,
    },
    estado: {
    type: "varchar",
    length: 50,
    default: "pendiente",
    },
    tipo_pago: {
    type: "enum",
    enum: ["contado", "plazo"],
    default: "contado",
    },
    cuotas: {
    type: "int",
    nullable: true,
    default: null,
    },
    fecha_vencimiento: {
    type: "timestamp",
    nullable: true,
    },
    clases_restantes: {
    type: "int",
    nullable: false,
    default: 0,
    },
    comprobante: {
    type: "varchar",
    length: 255,
    nullable: true,
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
},
});

export default Venta;