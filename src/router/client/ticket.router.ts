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
 *   TicketForecast:
 *      properties:
 *        ticketList:
 *          type: array
 *          items:
 *            $ref: '#/definitions/TicketNumberParam'
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
 *     security:
 *       - ClientApiAuth: []
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
