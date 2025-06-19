import { Router } from "express";
import { getAllUser } from "../controllers/admin";
import { protect } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/roleMiddleware";

const router = Router();

/**
 * @swagger
 * /admin/get-users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 */
router.get("/get-users", protect, isAdmin, getAllUser);

export default router;
