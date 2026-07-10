import { useEffect, useState } from "react";
import { useGetClase } from "@hooks/Clase/useGetClase.jsx";
import { DUPageBrowser } from "../components/daisyui/DUPageBrowser.jsx";

const HistorialGeneralClases = () => {
    const [claseData, setClaseData] = useState([]);
    const [Clases, fetchClase] = useGetClase(claseData, setClaseData);
    const [filtroEstado, setFiltroEstado] = useState("todos");

    useEffect(() => {
        if (typeof fetchClase === 'function') {
            fetchClase();
        }
    }, []);

    const getEstadoBadge = (estado) => {
        const estadoStr = String(estado).toLowerCase();
        switch (estadoStr) {
            case 'completada':
                return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Completada</span>;
            case 'pendiente':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pendiente</span>;
            case 'no_realizada':
                return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">No Realizada</span>;
            case 'cancelada':
                return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Cancelada</span>;
            case 'inasistente':
                return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Inasistente</span>;
            default:
                return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase">{estado}</span>;
        }
    };

    // Filtrar clases
    const clasesFiltradas = Array.isArray(Clases) ? Clases.filter(clase => {
        if (filtroEstado === "todos") return true;
        return String(clase.estado_clase).toLowerCase() === filtroEstado;
    }) : [];

    // Paginacion
    const POSTS_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const lastPostIndex = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = clasesFiltradas.slice(firstPostIndex, lastPostIndex);
    const pageAmount = Math.abs(Math.ceil(clasesFiltradas.length / POSTS_PER_PAGE)) || 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Historial General de Clases</h1>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => { setFiltroEstado('todos'); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filtroEstado === 'todos' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => { setFiltroEstado('completada'); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filtroEstado === 'completada' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Completadas
                    </button>
                    <button
                        onClick={() => { setFiltroEstado('pendiente'); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filtroEstado === 'pendiente' ? 'bg-white text-yellow-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => { setFiltroEstado('cancelada'); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filtroEstado === 'cancelada' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Canceladas
                    </button>
                    <button
                        onClick={() => { setFiltroEstado('inasistente'); setCurrentPage(1); }}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            filtroEstado === 'inasistente' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Inasistencias
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                {clasesFiltradas.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No se encontraron clases para el filtro seleccionado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Horario</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Tipo</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Profesor</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Vehículo</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Alumnos</th>
                                    <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageContent.map((clase) => (
                                    <tr key={clase.id_clase} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {clase.fecha_clase}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                                            {clase.hora_inicio} - {clase.hora_fin}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 uppercase">
                                            {clase.tipo}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {clase.profesores ? clase.profesores.nombre : 'Sin asignar'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {clase.vehiculos ? clase.vehiculos.patente : 'N/A'}
                                        </td>
                                        <td 
                                            className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate cursor-help" 
                                            title={clase.users?.map(u => `${u.nombre} (${u.email})`).join(',\n') || 'Sin alumnos asignados'}
                                        >
                                            {clase.users?.length > 0 ? (
                                                <span className="font-semibold text-blue-600">{clase.users.length} alumno(s)</span>
                                            ) : (
                                                <span className="text-gray-400">0 alumnos</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {getEstadoBadge(clase.estado_clase)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pageAmount > 1 && (
                <DUPageBrowser 
                    setCurrentPageNumber={setCurrentPage} 
                    currentPageNumber={currentPage} 
                    pageAmount={pageAmount} 
                />
            )}
        </div>
    );
};

export default HistorialGeneralClases;
