import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas protegidas (solo admin)
router.get("/", verifyToken, verifyAdmin, getAllUsers);

export default router;
