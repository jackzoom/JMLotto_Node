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

export default router;
