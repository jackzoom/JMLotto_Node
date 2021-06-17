import { Ticket, TicketDocument } from "../models/ticket.model";

interface DBI<T> {
  addTicketBatch(ticketInfo: any): Promise<TicketDocument>;
  getTicektList(): any;
  getUnVerifyTicektList(): any
}

export default new (class TicketDao<T> implements DBI<T> {
  /**
   * 添加彩票
   * @param ticketInfo 
   * @returns 
   */
  addTicketBatch(ticketInfo: any): Promise<TicketDocument> {
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
   * 获取未验证的彩票列表
   * @returns 
   */
  getUnVerifyTicektList(): any {
    return Ticket.aggregate([{
      $match: {
        ticketStatus: 0
      }
    }])
  }
})();
