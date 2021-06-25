import { Request, Response } from "express";
import Base from "../base.controller";
import TicketDao from "../../dao/ticket.dao";
import PeriodDao from "../../dao/period.dao";
import OrderDao from "../../dao/order.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { Types } from "mongoose";
import logger from "../../utils/logger";
import { getTicketPrice, verifyTicketResult } from "../../utils/ticket";
import { TicketDocument } from "../../models/ticket.model";

export default new (class ClientTicket extends Base {
  constructor() {
    super();
    this.addTicket = this.addTicket.bind(this);
    this.forecastPrice = this.forecastPrice.bind(this);
    this.pollingTicket = this.pollingTicket.bind(this);
  }

  /**
   * 添加彩票 Add Ticket
   * @route client/ticket/addTicket
   * @param ticketList 彩票列表
   * @param ticketList -> redNumber 红球号码
   * @param ticketList -> blueNumber 篮球号码
   * @param periodId 期数ID
   */
  async addTicket(req: Request, res: JwtAuthResponse): Promise<void> {
    let batchList: Array<TicketDocument | any> = [];
    let { ticketList, periodId, orderId } = req.body;
    let { userId } = res.authUser;
    let totalPrice = 0;
    try {
      ticketList.forEach((item: any) => {
        batchList.push({
          redNumber: item.redNumber,
          blueNumber: item.blueNumber,
          userId: Types.ObjectId(userId),
          periodId: Types.ObjectId(periodId),
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
        // console.log("新增彩票验证：", drawResult);
        if (drawResult.periodStatus === 1) {
          ticketInfo.forEach(async (item: any) => {
            let redArr = item.redNumber.split(",");
            let blueArr = item.blueNumber.split(",");
            let result = verifyTicketResult(
              redArr,
              blueArr,
              drawResult.lotteryResult.split(" ")
            );
            let drawTicket = await TicketDao.updateTicketStatus(
              item._id,
              result
            );
            if (result.status === 1) {
              logger.info("[新增彩票] 更新一个中奖彩票 ticketId：" + item._id);
              drawList.push(drawTicket.toJSON());
            }
          });
        }
        this.ResponseSuccess(res, {
          ticketInfo,
          drawList,
        });
      });
    } catch (err) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 价格预估 Forecast ticket price
   * @route client/ticket/forecast
   * @param ticketList 彩票列表
   * @param ticketList -> redNumber 红球号码
   * @param ticketList -> blueNumber 篮球号码
   */
  async forecastPrice(req: Request, res: JwtAuthResponse): Promise<void> {
    //TODO：校验彩票列表数据有效性
    let { ticketList } = req.body;
    let result: Array<object> = [];
    let totalPrice: number = 0;
    try {
      ticketList.forEach((item: any) => {
        let itemPrice = getTicketPrice(
          item.redNumber.split(",").length,
          item.blueNumber.split(",").length
        );
        result.push({
          redNumber: item.redNumber,
          blueNumber: item.blueNumber,
          price: itemPrice,
        });
        totalPrice += itemPrice;
      });
      this.ResponseSuccess(res, {
        ticketList: result,
        totalPrice,
      });
    } catch (err) {
      console.log(err);
      this.ResponseError(res, err);
    }
  }

  /**
   * 轮循数据库验证中奖信息
   * @description `Ticket->ticketStatus=0`
   */
  async pollingTicket(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let lastPeriod = await PeriodDao.getLastPeriod();
        let ticketList = await TicketDao.getUnVerifyTicektList(lastPeriod._id);
        for (let item of ticketList) {
          //TODO:核算中奖信息
          let redArr = item.redNumber.split(",");
          let blueArr = item.blueNumber.split(",");
          let result = verifyTicketResult(
            redArr,
            blueArr,
            lastPeriod.lotteryResult.split(" ")
          );
          TicketDao.updateTicketStatus(item._id, result).then((res: any) => {
            if (result.status === 1)
              logger.info(
                "[轮循数据库] 更新一个中奖彩票 ticketId：" + item._id
              );
          });
        }
        resolve();
      } catch (err) {
        logger.error("轮循数据库异常：" + err);
        reject();
      }
    });
  }
})();
