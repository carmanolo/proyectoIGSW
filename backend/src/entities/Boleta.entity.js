import { EntitySchema } from "typeorm";

export const Boleta = new EntitySchema({
  name: "Boleta",
  tableName: "boletas",
  columns: {
    id_boleta: {
      primary: true,
      type: "int",
      generated: true,
    },
    numero_boleta: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
    monto: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    fecha_pago: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    metodo_pago: {
      type: "enum",
      enum: ["transferencia", "efectivo", "tarjeta", "webpay"],
      default: "transferencia",
    },
    banco_origen: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    banco_destino: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    numero_cuenta_origen: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    numero_cuenta_destino: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    rut_titular: {
      type: "varchar",
      length: 12,
      nullable: true,
    },
    nombre_titular: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    url_comprobante: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    estado: {
      type: "enum",
      enum: ["pendiente", "verificada", "rechazada"],
      default: "pendiente",
    },
    fecha_verificacion: {
      type: "timestamp",
      nullable: true,
    },
    observaciones_verificacion: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    usuario: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "usuario_id",
        referencedColumnName: "id",
      },
      onDelete: "CASCADE",
      nullable: false,
    },
    plan: {
      type: "many-to-one",
      target: "Plan",
      joinColumn: {
        name: "plan_id",
        referencedColumnName: "id_plan",
      },
      onDelete: "CASCADE",
      nullable: false,
    },
  },
});

export default Boleta;