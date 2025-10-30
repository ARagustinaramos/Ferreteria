import express from "express";
import { createUser, updateUserList, toggleUserActive } from "../controllers/adminController.js";

const router = express.Router();
router.post("/user", createUser);
router.put("/user/:id/list", updateUserList);
router.put("/user/:id/toggle", toggleUserActive);
export default router;
