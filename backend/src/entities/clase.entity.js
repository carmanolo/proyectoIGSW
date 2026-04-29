import { EntitySchema } from "typeorm";

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
    user_id:{
      primary: false,
      type: "int",
    }
  },
  relations:{
    user:{
      target:"User",
      type:"many-to-one",
      joinColumn: { name: "user_id" },
      nullable: false,
      onDelete: "CASCADE",
    }
    
  }
});

export default Clase;
