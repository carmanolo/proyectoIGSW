import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rol: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    clases_disponibles: {
      type: "int",
      nullable: true,
      default: 0,
    },
    clases_basicas_completadas: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    // NUEVOS CAMPOS
    rut: {
      type: "varchar",
      length: 12,
      nullable: true,
      unique: true,
    },
    telefono: {
      type: "varchar",
      length: 15,
      nullable: true,
    },
    sede: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    estado_registro: {
      type: "varchar",
      length: 50,
      default: "en_espera",
      nullable: false,
    },
    fecha_registro_espera: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    fecha_verificacion: {
      type: "timestamp",
      nullable: true,
    },
    observaciones_verificacion: {
      type: "text",
      nullable: true,
    },
    verificador_id: {
      type: "int",
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
    clase: {
      type: "many-to-many",
      target: "Clase",
      inverseSide: "users",
    },
    plan_contratado: {
      type: "many-to-one",
      target: "Plan",
      joinColumn: {
        name: "plan_contratado_id",
        referencedColumnName: "id_plan",
      },
      nullable: true,
    },
    verificador: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "verificador_id",
        referencedColumnName: "id",
      },
      nullable: true,
    },
    boletas: {
      type: "one-to-many",
      target: "Boleta",
      inverseSide: "usuario",
    }
  }
});

export default User;
 /*
import { EntitySchema} from "typeorm";
//import Clase from "./clase.entity.js";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: true,
    },

    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rol: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    clases_disponibles: {
      type: "int",
      nullable: true,
      default: 0,
    },
    clases_basicas_completadas: {
      type: "boolean",
      nullable: false,
      default: false,
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
  relations:{
    clase:{
      type: "many-to-many",
      target: "Clase",
      inverseSide: "users",
    }
  }
});

export default User;
*/