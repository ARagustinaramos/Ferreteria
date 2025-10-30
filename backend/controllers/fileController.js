import multer from "multer";
import { File } from "../models/File.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });

export const uploadFile = async (req, res) => {
  try {
    const { listNumber, fileType } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Archivo no enviado" });
    }
    if (!listNumber || !fileType) {
      return res.status(400).json({ message: "Faltan campos: listNumber o fileType" });
    }
    const file = await File.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType,
      listNumber,
    });
    res.json(file);
  } catch (error) {
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
