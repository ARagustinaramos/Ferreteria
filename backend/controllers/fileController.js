import multer from "multer";
import { Op } from "sequelize";
import { File } from "../models/File.js";
import { User } from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "temp/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    const { listNumber, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Archivo no enviado" });
    }

    // Detectar extensión real
    const originalName = req.file.originalname.toLowerCase();
    const isPdf = originalName.endsWith(".pdf");
    const isExcel =
      originalName.endsWith(".xlsx") || originalName.endsWith(".xls");

    const fileType = isPdf ? "pdf" : isExcel ? "excel" : null;

    if (!fileType) {
      return res.status(400).json({ message: "Formato no permitido" });
    }

    // Categoría final real: pdf y excel NO deben mezclarse
    let finalCategory = category;
    if (category === "lista") {
      finalCategory = isPdf ? "listas-pdf" : "listas-excel";
    }

    // IMPORTANTÍSIMO: Cloudinary → todo en RAW
    const resourceType = "raw";

    // Mapeo de carpetas
    const folderMap = {
      "listas-pdf": "listas",
      "listas-excel": "listas",
      ofertas: "ofertas",
      maquinas: "maquinas",
    };

    const uploadFolder = `dhm_files/${folderMap[finalCategory]}`;

    // Buscar archivo previo SOLO por categoría exacta
    let existingFile = null;

    if (finalCategory.includes("listas")) {
      existingFile = await File.findOne({
        where: {
          listNumber: Number(listNumber),
          category: finalCategory, // 🔥 YA NO mezclás pdf y excel
        },
      });
    } else {
      existingFile = await File.findOne({
        where: { category: finalCategory },
      });
    }

    // Subir archivo (PDF y Excel → siempre raw)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: uploadFolder,
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      invalidate: true,
    });

    fs.unlinkSync(req.file.path);

    // Borrar archivo previo si existe
    if (existingFile) {
      await cloudinary.uploader.destroy(existingFile.publicId, {
        resource_type: "raw", 
        invalidate: true,
      });

      await existingFile.destroy();
    }

    // Crear nuevo registro
    const newFile = await File.create({
      fileName: req.file.originalname,
      fileType,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      category: finalCategory,
      listNumber: finalCategory.includes("listas")
        ? Number(listNumber)
        : null,
    });

    res.json({
      message: existingFile
        ? "Archivo reemplazado correctamente"
        : "Archivo subido correctamente",
      file: newFile,
    });

  } catch (error) {
    console.error("Error al subir archivo:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getFilesByList = async (req, res) => {
  try {
    const { listNumber } = req.params;
    const files = await File.findAll({ where: { listNumber } });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVisibleFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const files = await File.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { listNumber: user.listNumber },
              { category: { [Op.in]: ["listas-pdf", "listas-excel"] } }
            ]
          },
          { category: "ofertas" },
          { category: "maquinas" },
        ],
      },
    });

    res.json(files);
  } catch (error) {
    console.error("Error al obtener archivos visibles:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllFiles = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado: solo administradores" });
    }

    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    console.error("Error al obtener todos los archivos:", error);
    res.status(500).json({ message: "Error al obtener archivos" });
  }
};

export const getPublicFiles = async (req, res) => {
  try {
    const files = await File.findAll({
      where: {
        category: ["ofertas", "maquinas"],
      },
      order: [["category", "ASC"]],
    });

    res.status(200).json(files);
  } catch (error) {
    console.error("Error al obtener archivos públicos:", error);
    res.status(500).json({ message: "Error al obtener archivos" });
  }
};

export const serveFile = async (req, res) => {
  try {
    const id = req.params.id;
    const download = req.query.download === "true"; // Detectar modo descarga

    const file = await File.findByPk(id);
    if (!file) return res.status(404).send("Archivo no encontrado");

    const cloudUrl = file.fileUrl;

    // Obtener archivo desde Cloudinary como stream
    const response = await axios.get(cloudUrl, { responseType: "stream" });

    // Tipo de archivo correcto
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "application/octet-stream"
    );

    // 🔥 SI download=true → forzar descarga
    if (download) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(file.fileName)}"`
      );
    } else {
      // Mostrar en navegador
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(file.fileName)}"`
      );
    }

    response.data.pipe(res);
  } catch (err) {
    console.error("Error sirviendo archivo:", err);
    res.status(500).json({ message: "Error al servir el archivo" });
  }
};

