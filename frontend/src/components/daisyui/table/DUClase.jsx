
import { IoMdSettings } from 'react-icons/io';
import { MdDelete } from "react-icons/md";

/*import { NamePlusIcon } from './utils/NamePlusIcon.jsx';
import { GiGraduateCap } from 'react-icons/gi';*/
const formatDate = (date) => {
  const DEFAULT_DATE = "1-1-1970";
  try {
    const ISODate = new Date(date || 0).toISOString().split("T")[0];
    const dateArray = ISODate.split("-");
    return `${Number(dateArray[2] || 1)}-${Number(dateArray[1] || 1)}-${Number(dateArray[0] || 1970)}`;
  } catch (error) {
    console.error(error);
    return DEFAULT_DATE;
  }
};



const mostrarClases = (data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases) => {
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
                      {Clase.tipo === "teorica" && (
                        <button
                          className='btn btn-info btn-sm m-1'
                          onClick={()=>{handleEditarAsignacion(Clase.id_clase)}}
                          disabled={loadingEditarAsignacion}
                        >
                          {loadingEditarAsignacion ? 'actualizando' : 'Editar asignacion'}
                        </button>
                      )}
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

export const DUClaseTable = ({data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases}) => {

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
              {mostrarClases(data, handleEditClase, handleDeleteClase, handleEditarAsignacion, loadingEditarAsignacion, canCrudClases)}
            </tbody>
        </table>
        </div>
    ); 
}