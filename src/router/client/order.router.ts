import { Router } from "express";
import ClientOrder from "../../controllers/client/order.controller";
const router: Router = Router({ caseSensitive: true });


/**
 * @swagger
 *
 * definitions:
 *   TicketNumberParam:
 *      properties:
 *        redNumber:
 *          type: string
 *        blueNumber:
 *          type: string
 *   OrderAdd:
 *      properties:
 *        ticketList:
 *          type: array
 *          items:
 *            $ref: '#/definitions/TicketNumberParam'
 *        periodId:
 *          type: string
 *   TicketForecast:
 *      properties:
 *        ticketList:
 *          type: array
 *          items:
 *            $ref: '#/definitions/TicketNumberParam'
 *
 * /client/order:
 *   post:
 *     summary: 新增订单
 *     description: 新增单个或多组彩票
 *     tags:
 *       - name: Client
 *         description: 订单管理
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
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/OrderAdd'
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
 router.post("/", ClientOrder.addOrder);

/**
 * @swagger
 *
 * definitions:
 *   TicketItem:
 *     properties:
 *       ticketId:
 *         type: string
 *         description: 彩票编号
 *       redNumber:
 *         type: string
 *         description: 红球
 *       blueNumber:
 *         type: string
 *         description: 篮球
 *   OrderData:
 *     properties:
 *       orderPrice:
 *         type: string
 *         description: 订单金额
 *       orderId:
 *         type: string
 *         description: 订单编号
 *       ticketList:
 *         type: array
 *         description: 订单列表
 *         items:
 *           $ref: '#/definitions/TicketNumberParam'
 *
 * /client/order:
 *   get:
 *     summary: 获取订单列表 
 *     description: 获取订单列表
 *     tags:
 *       - name: Client
 *         description: 订单管理
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
 *                       type: array
 *                       $ref: '#/components/schemas/Paging'
 *                       properties:
 *                          content:
 *                            type: array
 *                            items:
 *                              $ref: '#/definitions/OrderData'
 *
 */
router.get("/", ClientOrder.getOrderList);

/**
 * @swagger
 *
 * /client/order/detail:
 *   get:
 *     summary: 获取订单详情
 *     description: 获取订单详情
 *     tags:
 *       - name: Client
 *         description: 订单管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: auth token.
 *         in: header
 *         required: false
 *         type: string
 *       - name: orderId
 *         description: 订单编号.
 *         in: query
 *         required: true
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
 *                       $ref: '#/definitions/OrderData'
 *
 */
router.get("/detail", ClientOrder.getOrderDetail);

export default router;
