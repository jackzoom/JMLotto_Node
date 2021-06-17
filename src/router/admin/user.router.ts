import { Router } from "express";
import AdminUser from "../../controllers/admin/user.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * definitions:
 *   UserListData:
 *      description: User Params
 *      properties:
 *        userId:
 *          type: string
 *          description: 用户ID
 *        account:
 *          type: string
 *          description: 账户名
 *        isAdmin:
 *          type: number
 *          description: 是否为管理员
 *        nickName:
 *          type: string
 *          description: 微信昵称
 *        gender:
 *          type: number
 *          description: 性别
 *        parentId:
 *          type: string
 *          description: 父级关联用户ID
 *        openId:
 *          type: string
 *          description: 微信小程序OpenId
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
 *                       type: array
 *                       $ref: '#/components/schemas/Paging'
 *                       properties:
 *                          content:
 *                            type: array
 *                            items:
 *                              $ref: '#/definitions/UserListData'
 */
router.get("/", AdminUser.getUserList);

/**
 * @swagger
 *
 * /admin/user/getUser:
 *   get:
 *     summary: 获取用户信息
 *     description: 根据Token获取用户信息
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
router.get("/getUser", AdminUser.getUser);

/**
 * @swagger
 *
 * definitions:
 *   InsertUserParam:
 *      description: User Params
 *      properties:
 *        account:
 *          type: string
 *          default: ''
 *        password:
 *          type: string
 *          default: ''
 *
 * /admin/user/insertTestUser:
 *   post:
 *     summary: 添加测试用户
 *     description: 添加测试用户
 *     tags:
 *       - name: Admin
 *         description: 用户管理
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: false
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/InsertUserParam'
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
router.post("/insertTestUser", AdminUser.insertTestUser);

export default router;
