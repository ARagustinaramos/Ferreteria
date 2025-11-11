import multer from "multer";
import { File } from "../models/File.js";
import { User } from "../models/User.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });


export const uploadFile = async (req, res) => {
  try {
    const { listNumber, fileType, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Archivo no enviado" });
    }
    if (!fileType) {
      return res.status(400).json({ message: "Falta el campo fileType" });
    }

    const validCategories = ["lista", "ofertas", "maquinas"];
    const finalCategory = validCategories.includes(category)
      ? category
      : "lista";

    const file = await File.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType,
      listNumber: finalCategory === "lista" ? listNumber || null : null,
      category: finalCategory,
    });

    res.json({ message: "Archivo subido correctamente", file });
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
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const files = await File.findAll({
      where: {
        [File.sequelize.Op.or]: [
          { listNumber: user.listNumber },
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
      return res.status(403).json({ message: "Acceso denegado: solo administradores" });
    }

    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    console.error("Error al obtener todos los archivos:", error);
    res.status(500).json({ message: "Error al obtener archivos" });
  }
};
