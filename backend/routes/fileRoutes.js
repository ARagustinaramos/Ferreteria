import express from "express";
import { upload, uploadFile, getFilesByList } from "../controllers/fileController.js";

const router = express.Router();
router.post("/upload", upload.single("file"), uploadFile);
router.get("/list/:listNumber", getFilesByList);
export default router;
