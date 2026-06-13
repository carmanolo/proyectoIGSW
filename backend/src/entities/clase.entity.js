import { EntitySchema, JoinColumn } from "typeorm";

export const Clase = new EntitySchema({
  name: "Clase",
  tableName: "clases",
  columns: {
    id_clase: {
      primary: true,
      type: "int",
      generated: true,
    },
    tipo:{
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion:{
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fecha_clase:{
      type:"date",
      nullable:false
    },
    hora_inicio: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    hora_fin: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    dia: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
  },
  relations:{
    users:{
      target:"User",
      type:"many-to-many",
      joinTable: {
        name: "clase_users",
        JoinColumn: {name: "id_clase"},
        inverseSide: {name : "id"}
      },
      inverseSide: "clase"
    }
    
  }
});

export default Clase;
