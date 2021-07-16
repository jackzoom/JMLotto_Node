import { Router } from "express";
import ClientPeriod from "../../controllers/client/period.controller";
const router: Router = Router({ caseSensitive: true });

/**
 * @swagger
 *
 * definitions:
 *   PeriodData:
 *     properties:
 *       lotteryRedNumber:
 *         type: string
 *         description: 开奖红球号码
 *       lotteryBlueNumber:
 *         type: string
 *         description: 开奖蓝球号码
 *       lotteryTime:
 *         type: string
 *         description: 开奖时间
 *
 * /client/period:
 *   get:
 *     summary: 获取周期列表 
 *     description: 获取周期列表
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
 *                              $ref: '#/definitions/PeriodData'
 *
 */
router.get("/", ClientPeriod.getPeriodList);

/**
 * @swagger
 *
 * /client/period/detail:
 *   get:
 *     summary: 获取周期详情
 *     description: 获取周期详情
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
 *       - name: periodId
 *         description: 周期编号.
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
 *                       $ref: '#/definitions/PeriodData'
 *
 */
router.get("/detail", ClientPeriod.getPeriodDetail);

/**
 * @swagger
 *
 * /client/period/last:
 *   get:
 *     summary: 最后一期开奖详情
 *     description: 获取最后一期开奖详情
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
 *                       $ref: '#/definitions/PeriodData'
 *
 */
router.get("/last", ClientPeriod.getLastPeriod);

/**
 * @swagger
 *
 * /client/period/ticket:
 *   get:
 *     summary: 指定周期投注列表
 *     description: 获取指定周期投注列表
 *     tags:
 *       - name: Client
 *         description: 彩票管理
 *     produces:
 *       - application/json
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
 *                       $ref: '#/definitions/PeriodData'
 *
 */
router.get("/ticket", ClientPeriod.getPeriodTicketList);

export default router;
