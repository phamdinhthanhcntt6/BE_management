import { Router } from "express";
import { getMe, login, register } from "../controllers/user";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;
