import { Router } from "express";
import {
  changePassword,
  getMe,
  login,
  register,
  updateUser,
} from "../controllers/user";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update/:id", protect, updateUser);
router.post("/change-password", protect, changePassword);

export default router;
