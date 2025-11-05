import express from "express";
import {
  upload,
  uploadFile,
  getFilesByList,
  getVisibleFiles,
} from "../controllers/fileController.js";

const router = express.Router();


router.post("/upload", upload.single("file"), uploadFile);
router.get("/list/:listNumber", getFilesByList);
router.get("/visible/:userId", getVisibleFiles);

export default router;
