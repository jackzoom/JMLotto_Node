import { Router } from "express";
const router: Router = Router({ caseSensitive: true });
import User from "./user";

/**
 * @swagger
 *
 * components:
 *   schemas:
 *      Basic:
 *        properties:
 *          errorCode:
 *            type: integer
 *            description: 状态码
 *          errorMsg:
 *            type: string
 *            description: 错误消息
 */
router.use("/user", User);

export default router;
