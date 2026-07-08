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
    estado: {
    type: "varchar",
    length: 50,
    default: "pendiente",
    },
    comprobante_url: {
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