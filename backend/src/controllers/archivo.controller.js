import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../../uploads/descargables");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const formatFileInfo = (fileName) => {
  const filePath = path.join(uploadDir, fileName);
  const stat = fs.statSync(filePath);
  return {
    filename: fileName,
    originalName: fileName,
    size: stat.size,
    uploadedAt: stat.mtime.toISOString(),
    url: `/uploads/descargables/${encodeURIComponent(fileName)}`,
  };
};

export const listarArchivosDescargables = async (req, res) => {
  try {
    const entries = fs.readdirSync(uploadDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => formatFileInfo(entry.name))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return handleSuccess(res, 200, "Archivos obtenidos correctamente", entries);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al listar archivos descargables", error.message, error);
  }
};

export const subirArchivoDescargable = async (req, res) => {
  try {
    if (!req.file) {
      return handleErrorClient(res, 400, "Debes adjuntar un archivo");
    }

    const metadata = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      url: `/uploads/descargables/${req.file.filename}`,
    };

    return handleSuccess(res, 201, "Archivo subido correctamente", metadata);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al subir el archivo", error.message, error);
  }
};

export const eliminarArchivoDescargable = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return handleErrorClient(res, 404, "El archivo no existe");
    }

    fs.unlinkSync(filePath);
    return handleSuccess(res, 200, "Archivo eliminado correctamente", { filename });
  } catch (error) {
    return handleErrorServer(res, 500, "Error al eliminar el archivo", error.message, error);
  }
};
