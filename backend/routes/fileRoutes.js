import express from "express";
import {
  upload,
  uploadFile,
  getFilesByList,
  getVisibleFiles,
  getAllFiles, 
} from "../controllers/fileController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/list/:listNumber", getFilesByList);
router.get("/visible/:userId", getVisibleFiles);
router.get("/", verifyToken, getAllFiles); 
export default router;
