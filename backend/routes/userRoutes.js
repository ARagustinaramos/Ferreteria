import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", verifyToken, verifyAdmin, getAllUsers);

export default router;
