import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/boletas/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const rut = req.body.rut || 'sin_rut';
    cb(null, `boleta_${rut}_${uniqueSuffix}.pdf`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

export const uploadBoleta = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

export const validarBoletaPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Debe subir un archivo PDF de la boleta'
      });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    
    const pdfSignature = fileBuffer.slice(0, 4).toString();
    if (pdfSignature !== '%PDF') {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'El archivo no es un PDF válido'
      });
    }

    const fileEnd = fileBuffer.slice(-5).toString();
    if (!fileEnd.includes('%%EOF')) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: 'El archivo PDF está corrupto o incompleto'
      });
    }

    const contenidoTexto = fileBuffer.toString('utf8', 0, 10000);
    const palabrasBoleta = ['boleta', 'factura', 'pago', 'transferencia', 'total', 'monto'];
    const tienePalabrasBoleta = palabrasBoleta.some(palabra => 
      contenidoTexto.toLowerCase().includes(palabra.toLowerCase())
    );

    req.file.validation = {
      esPDF: true,
      esBoleta: tienePalabrasBoleta,
      tamano: req.file.size,
      ruta: req.file.path
    };

    next();
  } catch (error) {
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo:', unlinkError);
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error al validar el archivo PDF: ' + error.message
    });
  }
};

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Máximo 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next(err);
};