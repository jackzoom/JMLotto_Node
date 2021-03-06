import { Router } from "express";
const router: Router = Router({ caseSensitive: true });
import User from "./user.router";
import Ticket from "./ticket.router";
import Order from "./order.router";
import Period from "./period.router";

/**
 * @swagger
 *
 * components:
 *   schemas:
 *      Basic:
 *        properties:
 *          errorCode:
 *            type: string
 *            description: 状态码
 *          errorMsg:
 *            type: string
 *            description: 错误消息
 *      Paging:
 *        properties:
 *          content:
 *            type: array
 *            description: 数据列表
 *          currentPage:
 *            type: number
 *            description: 当前页码
 *          pageSize:
 *            type: number
 *            description: 每页个数
 *          totalPages:
 *            type: number
 *            description: 总页数
 *          totalElement:
 *            type: number
 *            description: 总个数
 */

router.use("/user", User);
router.use("/ticket", Ticket);
router.use("/order", Order);
router.use("/period", Period);

export default router;
