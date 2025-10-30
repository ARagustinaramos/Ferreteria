import express from "express";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// Solo los administradores pueden ver todos los usuarios
router.get("/", verifyToken, verifyAdmin, getAllUsers);

export default router;
