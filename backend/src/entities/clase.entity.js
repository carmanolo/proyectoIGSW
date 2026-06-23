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
    estado_clase: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    id_profesor:{
      type: Number,
      primary: false,
      generated: false,
      nullable:true
    },
    id_auto: {
      type: Number,
      primary: false,
      generated: false,
      nullable:true
    }
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
    },
    vehiculos:{
      target:"Vehiculo",
      type:"many-to-one",
      joinColumn: {name:"id_auto"},
      onDelete:"CASCADE",
    },
    
  }
});

export default Clase;
