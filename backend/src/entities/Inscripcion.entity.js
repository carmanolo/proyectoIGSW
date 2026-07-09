import { EntitySchema } from "typeorm";

export const Inscripcion = new EntitySchema({
  name: "Inscripcion",
  tableName: "inscripciones",
  columns: {
    id_inscripcion: {
      primary: true,
      type: "int",
      generated: true,
    },
    plan_id: {
      type: "int",
      nullable: false,
    },
    fecha_contratacion: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    fecha_inicio: {
      type: "date",
      nullable: false,
    },
    fecha_fin: {
      type: "date",
      nullable: true,
    },
    estado_pago: {
      type: "enum",
      enum: ["pagado", "pendiente", "vencido"],
      default: "pendiente",
    },
    monto_total: {
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
    },
    fecha_vencimiento_pago: {
      type: "date",
      nullable: false,
    },
    fecha_pago_completo: {
      type: "timestamp",
      nullable: true,
    },
    estado_inscripcion: {
      type: "enum",
      enum: ["activa", "completada", "cancelada"],
      default: "activa",
    },
  },

  relations: {
    alumno: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "alumno_id",
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
  }
  },
});

export default Inscripcion;