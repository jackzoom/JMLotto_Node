import { Request, Response } from "express";
import Base from "../base.controller";
import TicketDao from "../../dao/ticket.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { Types } from "mongoose";
import logger from "../../utils/logger";
import { getTicketPrice } from "../../utils/verifyTicket";

export default new (class ClientTicket extends Base {
  constructor() {
    super();
    this.addTicket = this.addTicket.bind(this);
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
    let batchList: Array<object> = [];
    let { ticketList } = req.body;
    let { userId } = res.authUser;
    try {
      ticketList.forEach((item: any) => {
        batchList.push({
          redNumber: item.redNumber,
          blueNumber: item.blueNumber,
          userId: Types.ObjectId(userId),
          periodId: Types.ObjectId(item.periodId),
        });
      });
      console.log(batchList);
      TicketDao.addTicketBatch(batchList).then((ticketRes: any) => {
        this.ResponseSuccess(res, ticketRes);
      });
    } catch (err) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 轮询数据库验证中奖信息
   * @description `Ticket->ticketStatus=0`
   */
  async pollingTicket(): Promise<void> {
    return new Promise(async (resolve, reject) => {

      try {
        let ticketList = await TicketDao.getUnVerifyTicektList();
        for (let item of ticketList) {
          let redArr = item.redNumber.split(',');
          let blueArr = item.blueNumber.split(',');
          console.log("单个票信息：", { item, price: getTicketPrice(redArr.length, blueArr.length) })
          //TODO:核算中奖信息
        }       
        resolve()
      } catch (err) {
        logger.error("轮询彩票一异常：" + err)
        reject()
      }
    })
  }
})();
