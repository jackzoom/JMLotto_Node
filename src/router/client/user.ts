import express from "express";
import { getUser } from "../../controllers/client/user";
const router = express.Router();

/**
 * @swagger
 *
 * /client/user/getUser:
 *   get:
 *     summary: 获取用户信息
 *     description: 根据Token获取用户信息
 *     tags:
 *       - name: Client
 *         description: 用户管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: auth token.
 *         in: header
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Basic'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           description: 用户编号
 *                         userName:
 *                           type: string
 *                           description: 用户名称
 */
router.get("/getUser", getUser);
export default router;
