import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import OrderDao from "../../dao/order.dao";
import TicketDao from "../../dao/ticket.dao";
import PeriodDao from "../../dao/period.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { TicketDocument } from "../../models/ticket.model";
import { getTicketPrice, verifyTicketResult } from "../../utils/ticket";
import logger from "../../utils/logger";

export default new (class ClientOrder extends Base {
  constructor() {
    super();
    this.addOrder = this.addOrder.bind(this);
    this.getOrderList = this.getOrderList.bind(this);
    this.getOrderDetail = this.getOrderDetail.bind(this);
  }

  /**
   * 添加订单 Add Order
   * @route client/ticket/addTicket
   * @param ticketList 彩票列表
   * @param ticketList -> redNumber 红球号码
   * @param ticketList -> blueNumber 篮球号码
   * @param periodId 期数ID
   */
  async addOrder(req: Request, res: JwtAuthResponse): Promise<void> {
    let batchList: Array<TicketDocument | any> = [];
    let { ticketList, periodId, orderId } = req.body;
    let { userId } = res.authUser;
    let totalPrice = 0;
    try {
      ticketList.forEach((item: any) => {
        batchList.push({
          redNumber: item.redNumber,
          blueNumber: item.blueNumber,
          userId,
          periodId,
        });
        totalPrice += getTicketPrice(
          item.redNumber.split(",").length,
          item.blueNumber.split(",").length,
          2
        );
      });

      //生成订单 + 计算订单金额
      let orderRes = await OrderDao.addOrder({
        orderPrice: totalPrice,
        userId,
      });
      batchList = batchList.map((item) => {
        return {
          ...item,
          orderId: orderRes._id,
        };
      });
      TicketDao.addTicketBatch(batchList).then(async (ticketInfo: any) => {
        // 校验当前期是否已经开奖
        // - 已开奖
        //   - 直接验证中奖信息
        // - 未开奖
        //
        let drawResult = await PeriodDao.getPeriodById(periodId);
        let drawList: Array<any> = [];
        if (drawResult.periodStatus === 1) {
          for (let i = 0; i < ticketInfo.length; i++) {
            let ticketItem = ticketInfo[i];
            let redArr = ticketItem.redNumber.split(",");
            let blueArr = ticketItem.blueNumber.split(",");
            let result = verifyTicketResult(
              redArr,
              blueArr,
              drawResult.lotteryResult.split(" ")
            );
            let drawTicket = await TicketDao.updateTicketStatus(
              ticketItem._id,
              result
            );
            if (result.status === 1) {
              logger.info(
                "[新增彩票] 更新一个中奖彩票 ticketId：" + ticketItem._id
              );
              drawList.push(drawTicket.toJSON());
            }
          }
        }
        this.ResponseSuccess(res, {
          ticketList: ticketInfo,
          drawList,
        });
      });
    } catch (err) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 获取订单列表 GetOrderList
   * @group ClientOrder
   * @route GET /client/order
   * @param req
   * @param res
   */
  async getOrderList(req: Request, res: JwtAuthResponse) {
    let { userId } = res.authUser;
    let pageNum = (req.query.pageNum || 1) as number;
    let pageSize = (req.query.pageSize || 20) as number;
    try {
      OrderDao.getOrderList(userId, pageNum, pageSize)
        .then((data: any) => {
          this.ResponseSuccess(
            res,
            data.map((item: any) => {
              item.orderId = item._id;
              delete item._id;
              item.ticketList = item.ticketList.map((titem: any) => {
                titem.ticketId = titem._id;
                delete titem._id;
                return titem;
              });
              return item;
            })
          );
        })
        .catch((err: any) => {
          this.ResponseError(res, err);
        });
    } catch (err) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 获取订单详情 GetOrderDetail
   * @group ClientOrder
   * @route GET /client/order/detail
   * @param req
   * @param res
   */
  async getOrderDetail(req: Request, res: Response) {
    let { orderId } = req.query;
    OrderDao.getOrderById(orderId as string)
      .then((data: any) => {
        this.ResponseSuccess(res, data);
      })
      .catch((err: any) => {
        this.ResponseError(res, err);
      });
  }
})();
