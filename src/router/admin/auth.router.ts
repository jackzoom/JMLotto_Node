import { Router } from "express";
import AdminAuth from "../../controllers/admin/auth.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * definitions:
 *  loginParam:
 *      description: Login Params
 *      properties:
 *          account:
 *              type: string
 *          password:
 *              type: string
 */

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
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/loginParam'
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
