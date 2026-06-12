
import { IoMdSettings } from 'react-icons/io';
import { MdDelete } from "react-icons/md";

/*import { NamePlusIcon } from './utils/NamePlusIcon.jsx';
import { GiGraduateCap } from 'react-icons/gi';*/
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('es-CL'); 
};



const mostrarClases = (data, handleEditClase, handleDeleteClase, canCrudClases) => {
  if (Array.isArray(data) && data.length > 0) {
      return data.map((Clase) => (
                  <tr key={"Class-"+Clase.id_clase}>
                      <td>
                        <div className="badge badge-primary">
                          {String(Clase.tipo).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-primary">
                          {Clase.descripcion}
                        </div>
                      </td>
                      <td>{formatDate(Clase.fecha_clase)}</td>
                      <td>{Clase.hora_inicio}</td>
                      <td>{Clase.hora_fin}</td>
                      <td>
                        <div className="badge badge-secondary">
                          {String(Clase.dia).toUpperCase()}
                        </div>
                      </td>
                      {canCrudClases && (
                      <td>
                      <button className="btn btn-primary m-1" onClick={() => {handleEditClase(Clase.id_clase, Clase)}}><IoMdSettings></IoMdSettings></button>
                      <button className="btn btn-secondary m-1" onClick={() => {handleDeleteClase(Clase.id_clase, Clase)}}><MdDelete></MdDelete></button>
                      </td>
                      )}
                  </tr>
      ));
  } else {
      return (
          <tr>
              <td colSpan="7">No hay clases disponibles.</td>
          </tr>
      )
  }
}

export const DUClaseTable = ({data, handleEditClase, handleDeleteClase, canCrudClases}) => {

    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                {/*<th></th> */} 
                <th>Tipo</th>
                <th>Descripcion</th>
                <th>fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Término</th>
                <th>Día</th>
                {canCrudClases && (<th>Acciones</th>)}             
            </tr>
            </thead>
            <tbody>
              {mostrarClases(data, handleEditClase, handleDeleteClase, canCrudClases)}
            </tbody>
        </table>
        </div>
    ); 
}