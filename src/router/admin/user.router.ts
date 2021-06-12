import { Router } from "express";
import AdminUser from "../../controllers/admin/user.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * /admin/user:
 *   get:
 *     summary: 获取用户列表
 *     description: 获取用户列表
 *     tags:
 *       - name: Admin
 *         description: 用户管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: auth token.
 *         in: header
 *         required: false
 *         type: string
 *       - name: userId
 *         description: 用户编号
 *         in: query
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
router.get("/", AdminUser.getUserList);
export default router;
