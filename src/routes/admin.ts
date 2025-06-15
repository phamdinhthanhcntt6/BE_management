import { Router } from "express";
import { getAllUser } from "../controllers/admin";
import { protect } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/get-users", protect, isAdmin, getAllUser);

export default router;
