import { Request, Response } from "express";
import Base from "../base.controller";
import TicketDao from "../../dao/ticket.dao";
import PeriodDao from "../../dao/period.dao";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { Types } from "mongoose";
import logger from "../../utils/logger";
import { getTicketPrice, verifyTicketResult } from "../../utils/verifyTicket";
import { TicketDocument } from "../../models/ticket.model";
import ticketDao from "../../dao/ticket.dao";

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
    let batchList: Array<TicketDocument | any> = [];
    let { ticketList, periodId } = req.body;
    let { userId } = res.authUser;
    try {
      ticketList.forEach((item: any) => {
        batchList.push({
          redNumber: item.redNumber,
          blueNumber: item.blueNumber,
          userId: Types.ObjectId(userId),
          periodId: Types.ObjectId(periodId),
        });
      });
      TicketDao.addTicketBatch(batchList).then(async (ticketRes: any) => {
        // 校验当前期是否已经开奖
        // - 已开奖
        //   - 直接验证中奖信息
        // - 未开奖
        //
        let drawResult = await PeriodDao.getPeriodById(periodId);
        // console.log("新增彩票验证：", drawResult);
        if (drawResult.periodStatus === 1) {
          ticketRes.forEach((item: any) => {
            let redArr = item.redNumber.split(",");
            let blueArr = item.blueNumber.split(",");
            let result = verifyTicketResult(
              redArr,
              blueArr,
              drawResult.lotteryResult.split(" ")
            );
            TicketDao.updateTicketStatus(item._id, result).then(
              async (drawTicket: any) => {
                if (result.status === 1)
                  logger.info(
                    "[新增彩票] 更新一个中奖彩票 ticketId：" + item._id
                  );
                this.ResponseSuccess(res, drawTicket);
              }
            );
          });
        } else {
          return this.ResponseSuccess(res, ticketRes);
        }
      });
    } catch (err) {
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
