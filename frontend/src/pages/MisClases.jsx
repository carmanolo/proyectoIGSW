import { useEffect, useState } from "react";
import { getUserRole } from "@services/profile.service.js";
import {
    getArchivosDescargables,
    subirArchivoDescargable,
    eliminarArchivoDescargable,
} from "@services/archivo.service.js";
import { alertSuccess, alertError, confirmDelete } from "@helpers/sweetAlert.js";

const MisClases = () => {
    const userRole = getUserRole();
    const canUpload = userRole === "profesor" || userRole === "secretario";

    const [archivos, setArchivos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [buscar, setBuscar] = useState("");
    const [archivo, setArchivo] = useState(null);

    useEffect(() => {
        fetchArchivos();
    }, []);

    const fetchArchivos = async () => {
        try {
            setIsLoading(true);
            const data = await getArchivosDescargables();
            setArchivos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al obtener archivos:", error);
            alertError("Error al obtener los archivos");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!archivo) {
            alertError("Selecciona un archivo antes de subirlo");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("archivo", archivo);
            await subirArchivoDescargable(formData);
            alertSuccess("Archivo subido correctamente");
            setArchivo(null);
            event.target.reset();
            await fetchArchivos();
        } catch (error) {
            alertError("No se pudo subir el archivo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (filename) => {
        try {
            const isConfirmed = await confirmDelete("¿Deseas eliminar este archivo?");
            if (!isConfirmed) return;

            setIsLoading(true);
            await eliminarArchivoDescargable(filename);
            alertSuccess("Archivo eliminado correctamente");
            await fetchArchivos();
        } catch (error) {
            alertError("No se pudo eliminar el archivo");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredArchivos = archivos.filter((item) => {
        const text = `${item.filename || ""} ${item.originalName || ""}`.toLowerCase();
        return text.includes(buscar.toLowerCase());
    });

    return (
        <div className="p-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Material descargable</h1>
                <p className="text-sm opacity-70">
                    {canUpload
                        ? "Puedes ver, descargar y subir archivos compartidos para el curso."
                        : "Puedes ver y descargar los archivos compartidos para el curso."}
                </p>
            </div>

            {canUpload && (
                <form onSubmit={handleUpload} className="card bg-base-100 shadow-md p-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full max-w-xs"
                            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                        />
                        <button className="btn btn-primary" type="submit" disabled={isLoading}>
                            Subir archivo
                        </button>
                    </div>
                </form>
            )}

            <div className="flex gap-2 mb-4 flex-wrap items-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre de archivo"
                    className="input input-bordered flex-1 max-w-xs"
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                />
                {isLoading && <span className="loading loading-spinner"></span>}
            </div>

            {filteredArchivos.length === 0 ? (
                <div className="alert alert-info">
                    <span>No hay archivos disponibles</span>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredArchivos.map((archivoItem) => (
                        <div key={archivoItem.filename} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-lg">{archivoItem.originalName || archivoItem.filename}</h2>
                                <p className="text-sm opacity-70">
                                    {new Date(archivoItem.uploadedAt).toLocaleString("es-CL")}
                                </p>
                                <div className="card-actions justify-end mt-4 gap-2">
                                    <a
                                        href={`http://localhost:3000${archivoItem.url}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-sm btn-success"
                                    >
                                        Descargar
                                    </a>
                                    {canUpload && (
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(archivoItem.filename)}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisClases;
