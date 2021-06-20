import { Router } from "express";
import ClientTicket from "../../controllers/client/ticket.controller";
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
 *   TicketAdd:
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
 * /client/ticket/addTicket:
 *   post:
 *     summary: 新增彩票
 *     description: 新增单个或多组彩票
 *     tags:
 *       - name: Client
 *         description: 彩票管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: auth token.
 *         in: header
 *         required: false
 *         type: string
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TicketAdd'
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
router.post("/addTicket", ClientTicket.addTicket);

/**
 * @swagger
 *
 *
 * /client/ticket/forecast:
 *   post:
 *     summary: 购彩金额预估
 *     description: 预估单个或多组购彩金额
 *     tags:
 *       - name: Client
 *         description: 彩票管理
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: auth token.
 *         in: header
 *         required: false
 *         type: string
 *     requestBody:
 *       required: true
 *       name: body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/TicketForecast'
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
 *                         ticketList:
 *                           type: array
 *                           description: 详细列表
 *                         totalPrice:
 *                           type: string
 *                           description: 合计预估金额
 */
 router.post("/forecast", ClientTicket.forecastPrice);

export default router;
