import { Ticket, TicketDocument } from "../models/ticket.model";
import { RankResult } from "../interface/rank.interface";
import { Types } from "mongoose";

interface DBI<T> {
  addTicketBatch(ticketInfo: any): Promise<TicketDocument>;
  getTicektList(): any;
  getUnVerifyTicektList(periodId: string): any;
  updateTicketStatus(ticketId: string, rankData: RankResult): any;
  getTicketListByPeriodId(periodId: string, userId?: string): any
}

export default new (class TicketDao<T> implements DBI<T> {
  /**
   * 添加彩票
   * @param ticketInfo
   * @returns
   */
  addTicketBatch(ticketInfo: Array<TicketDocument>): any {
    return Ticket.insertMany(ticketInfo);
  }
  /**
   * 获取指定用户所有彩票列表
   * @returns
   */
  getTicektList(): any {
    return Ticket.find();
  }
  /**
   * 获取当前期未验证的彩票列表
   * @param {string} periodId
   * @returns
   */
  getUnVerifyTicektList(periodId: string): any {
    return Ticket.find({
      ticketStatus: 0,
      periodId: periodId,
    });
  }

  /**
   * 更新中奖信息
   */
  updateTicketStatus(ticketId: string, rankResult: RankResult): any {
    // console.log("更新中奖信息：", { ticketId, rankResult });
    return Ticket.findByIdAndUpdate(
      {
        _id: Types.ObjectId(ticketId),
      },
      {
        ticketStatus: rankResult.status === 1 ? 1 : 2,
        winningInfo: rankResult,
        verifyDate: new Date(),
      },
      { new: true }
    );
  }
  /**
   * 获取指定开奖周期投注列表
   * @param periodId 开奖周期ID
   * @param userId 用户ID
   */
  getTicketListByPeriodId(periodId: string, userId?: string): any {
    let match: any = { periodId: Types.ObjectId(periodId) };
    userId && (match['userId'] = userId)
    return Ticket.find(match)
  }
})();
