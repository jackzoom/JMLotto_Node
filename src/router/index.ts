import express from "express";
const router = express.Router();
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
router.use("/api/v1/client/user", User);

export default router;
