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