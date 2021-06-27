import { Request, Response } from "express";
import Base from "../base.controller";
import TicketDao from "../../dao/ticket.dao";
import PeriodDao from "../../dao/period.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";
import logger from "../../utils/logger";
import { getTicketPrice, verifyTicketResult } from "../../utils/ticket";
import { TicketDocument } from "../../models/ticket.model";

export default new (class ClientTicket extends Base {
  constructor() {
    super();
    this.forecastPrice = this.forecastPrice.bind(this);
    this.pollingTicket = this.pollingTicket.bind(this);
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
    } catch (err) {
      console.log(err);
      this.ResponseError(res, err);
    }
    this.ResponseSuccess(res, {
      ticketList: result,
      totalPrice,
    });
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
