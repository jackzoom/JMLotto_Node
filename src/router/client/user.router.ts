import { Router } from "express";
import ClientUser from "../../controllers/client/user.controller";
const router: Router = Router({ caseSensitive: true });


/**
 * @swagger
 * 
 * definitions:
 *  weappLoginParam:
 *      description: Login Params
 *      properties:
 *          code:
 *              type: string
 *          encryptedData:
 *              type: string
 *          iv:
 *              type: string
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
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/weappLoginParam'
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

/**
 * @swagger
 * 
 * definitions:
 *   AccountLogin:
 *     properties:
 *       account:
 *        type: string
 *        default: user
 *       password:
 *        type: string
 *        default: user
 *
 * /client/user/accountLogin:
 *   post:
 *     summary: 账户登录
 *     description: 账户密码登录
 *     tags:
 *       - name: Client
 *         description: 用户管理
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/AccountLogin'
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
router.post("/accountLogin", ClientUser.accountLogin);

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
 *     security:
 *       - ClientApiAuth: []
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
router.get("/getUser", ClientUser.getUser);

/**
 * @swagger
 *
 * /client/user/aggregate:
 *   get:
 *     summary: 获取用户聚合数据
 *     description: 根据Token获取用户聚合数据
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
 *     security:
 *       - ClientApiAuth: []
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
 *                         totalOrder:
 *                           type: number
 *                           description: 用户总投注
 *                         totalBill:
 *                           type: float
 *                           description: 用户总账单
 *                         totalWinning:
 *                           type: number
 *                           description: 用户总中奖次数
 */
router.get("/aggregate", ClientUser.getUserAggregate)

export default router;
