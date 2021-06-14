import { Router } from "express";
import AdminAuth from "../../controllers/admin/auth.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * /admin/auth/login:
 *   post:
 *     summary: 管理员登录
 *     description: 管理员登录
 *     tags:
 *       - name: Admin
 *         description: 登录
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: account
 *         description: 账户名
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: 密码
 *         in: body
 *         required: true
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
router.post("/login", AdminAuth.adminLogin);

export default router;
