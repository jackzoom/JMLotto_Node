import { Router } from "express";
import ClientUser from "../../controllers/client/user.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * /client/user/weappLogin:
 *   post:
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
 *       - name: encryptedData
 *         description: 完整用户信息的加密数据
 *         in: param
 *         required: true
 *         type: string
 *       - name: iv
 *         description: 加密算法的初始向量
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
router.post("/weappLogin", ClientUser.weappLogin);
export default router;
