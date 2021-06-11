import { Router } from "express";
import ClientUser from "../../controllers/client/user";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * /client/user/weappLogin:
 *   get:
 *     summary: 小程序登录
 *     description: 根据微信Code登录
 *     tags:
 *       - name: Client
 *         description: 用户管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: code
 *         description: 微信登录code
 *         in: param
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
router.get("/weappLogin", ClientUser.weappLogin);
export default router;
