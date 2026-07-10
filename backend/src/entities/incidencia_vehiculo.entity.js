import { EntitySchema } from "typeorm";

export const IncidenciaVehiculo = new EntitySchema({
  name: "IncidenciaVehiculo",
  tableName: "incidencias_vehiculos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente",
    },
    kilometraje_actual: {
      type: "int",
      nullable: true,
    },
    fecha_reporte: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
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
    vehiculo: {
      type: "many-to-one",
      target: "Vehiculo",
      joinColumn: {
        name: "vehiculo_id",
        referencedColumnName: "id",
      },
      inverseSide: "incidencias",
      nullable: false,
    },
    profesor: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "profesor_id",
        referencedColumnName: "id",
      },
      inverseSide: "incidencias_reportadas",
      nullable: false,
    },
  },
});

export default IncidenciaVehiculo;
