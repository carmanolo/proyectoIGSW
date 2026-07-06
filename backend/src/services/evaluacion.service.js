import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";
import { AppDataSource } from "../config/configDb.js";
import { Evaluacion } from "../entities/evaluaciones.entity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORTS_DIR = path.resolve(__dirname, "../../uploads/evaluaciones");

async function ensureExcelDir() {
  await fs.mkdir(EXPORTS_DIR, { recursive: true });
}

function isManejoField(fieldName) {
  return fieldName.startsWith("manejo_");
}

function getPracticeFieldCounts(data) {
  const counts = { sinFaltas: 0, leves: 0, graves: 0, reprobatorios: 0 };
  const practicePrefixes = [
    "comprobacion_",
    "ingreso_",
    "circulacion_",
    "cambio_",
    "viraje_",
    "interseccion_",
    "adelantamiento_",
    "estacionamiento_",
    "demarcaciones_",
    "manejo_",
    "observacion_",
    "senal_",
    "luces_",
    "preferencias_",
    "mandos_",
  ];

  Object.entries(data).forEach(([field, value]) => {
    if (!practicePrefixes.some((prefix) => field.startsWith(prefix))) {
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }

    if (numericValue === 0) counts.sinFaltas += 1;
    if (numericValue === 1) counts.leves += 1;
    if (numericValue === 2) counts.graves += 1;
    if (numericValue === 3) counts.reprobatorios += 1;
  });

  return counts;
}

function shouldMarkReprobado(evaluacion) {
  if (!evaluacion || !evaluacion.tipo_evaluacion) {
    return false;
  }

  if (evaluacion.tipo_evaluacion === "teorica") {
    const score = Number(evaluacion.calificacion_teorica);
    return !Number.isNaN(score) && score < 33;
  }

  if (evaluacion.tipo_evaluacion === "practica") {
    const { leves, graves, reprobatorios } = getPracticeFieldCounts(evaluacion);
    return reprobatorios >= 1 || graves >= 2 || (graves >= 1 && leves >= 5) || leves >= 10;
  }

  return false;
}

function sanitizeEvaluacionData(data) {
  const sanitized = { ...data };
  if (sanitized.tipo_evaluacion === "practica") {
    sanitized.calificacion_teorica = null;
  }

  if (sanitized.tipo_evaluacion === "teorica") {
    const keptFields = new Set([
      "alumno",
      "calificacion_teorica",
      "tipo_evaluacion",
      "Resultado",
      "comentario",
      "alumno_id",
      "alumno_relacion",
    ]);

    Object.keys(sanitized).forEach((field) => {
      if (!keptFields.has(field)) {
        sanitized[field] = null;
      }
    });
  }

  if (shouldMarkReprobado(sanitized)) {
    sanitized.Resultado = "reprobado";
  }

  return sanitized;
}

export async function generateEvaluacionExcel(evaluacion) {
  if (!evaluacion) {
    return null;
  }

  try {
    await ensureExcelDir();

    const cleanData = { ...evaluacion };
    delete cleanData.alumno_relacion;

    const headers = Object.keys(cleanData);
    const values = headers.map((header) => cleanData[header] ?? "");

    const worksheet = XLSX.utils.aoa_to_sheet([headers, values]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Evaluacion");

    const fileName = `evaluacion_${evaluacion.id_evaluacion || Date.now()}.xlsx`;
    const filePath = path.join(EXPORTS_DIR, fileName);
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    await fs.writeFile(filePath, buffer);
    return `/uploads/evaluaciones/${fileName}`;
  } catch (error) {
    console.error("Error al generar el Excel de la evaluación:", error);
    return null;
  }
}

export async function getEvaluacionSer(id = null) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    if (id) {
      const evaluacion = await evaluacionRepository.findOne({ where: { id_evaluacion: Number(id) }, relations: ["alumno_relacion"] });
      return evaluacion || null;
    }

    const evaluaciones = await evaluacionRepository.find({ relations: ["alumno_relacion"] });
    return evaluaciones;
  } catch (error) {
    console.error("Error al obtener los evaluacions", error);
    return null;
  }
}

export async function createEvaluacionSer(evaluacionData) {
  const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
  try {
    if (evaluacionData?.alumno_id && !evaluacionData?.alumno_relacion) {
      evaluacionData.alumno_relacion = { id: Number(evaluacionData.alumno_id) };
    }
    if (evaluacionData?.alumno && /^[0-9]+$/.test(String(evaluacionData.alumno))) {
      evaluacionData.alumno_relacion = { id: Number(evaluacionData.alumno) };
    }

    const newEvaluacion = evaluacionRepository.create(sanitizeEvaluacionData(evaluacionData));
    await evaluacionRepository.save(newEvaluacion);
    const excelPath = await generateEvaluacionExcel(newEvaluacion);
    return { ...newEvaluacion, excelPath };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateEvaluacionSer(evaluacion) {
  try {
    if (!evaluacion) {
      throw new Error("Funcion mal llamada");
    }
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    const updatedEvaluacion = await evaluacionRepository.save(sanitizeEvaluacionData(evaluacion));
    const excelPath = await generateEvaluacionExcel(updatedEvaluacion);
    return { data: { ...updatedEvaluacion, excelPath }, message: "evaluacion actualizado con éxito", error: null };
  } catch (error) {
    console.error("Error al actualizar el evaluacion:", error);
    return { data: null, message: "Error interno del servidor", error: error.message };
  }
}

export async function deleteEvaluacion(id_evaluacion) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
    const evaluacion = await evaluacionRepository.findOne({ where: { id_evaluacion: id_evaluacion } });

    if (!evaluacion) {
      return { result: null, message: "evaluacion no encontrado" };
    }

    return {
      result: await evaluacionRepository.delete({ id_evaluacion: evaluacion.id_evaluacion }),
      message: "evaluacion eliminado exitosamente",
    };
  } catch (error) {
    console.error(error);
    return { result: null, message: "Error al eliminar el evaluacion" };
  }
}
