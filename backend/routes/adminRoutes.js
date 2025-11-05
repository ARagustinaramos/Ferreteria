import express from "express";
import {
  createUser,
  updateUserList,
  toggleUserActive,
  getPriceLists,
} from "../controllers/adminController.js";
import { getAllUsers } from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/user", verifyToken, verifyAdmin, createUser);
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/user/:id/list", verifyToken, verifyAdmin, updateUserList);
router.put("/user/:id/toggle", verifyToken, verifyAdmin, toggleUserActive);
router.get("/pricelists", verifyToken, verifyAdmin, getPriceLists);

export default router;
