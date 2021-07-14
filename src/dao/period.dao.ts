import moment from "moment";
import { Period, PeriodDocument } from "../models/period.model";

interface PeriodFields {
  lotteryNumber: number;
  lotteryRedNumber?: string;
  lotteryBlueNumber?: string;
  lotteryResult?: string;
  lotteryUnsortResult?: string;
  lotteryTime?: Date;
  lotteryRealTime?: Date;
  periodStatus?: number;
}

interface DBI<T> {
  addPeriod(periodInfo: any): Promise<PeriodDocument>;
  updatePeriod(lotteryNumber: number, periodInfo: any): any;
  getPeriodList(pageNum: number, pageSize: number): any;
  getLastPeriod(): any;
  getPeriodByNum(drawNum: number): any;
}

export default new (class PeriodDao<T> implements DBI<T> {
  /**
   * 添加开奖信息
   * @param periodInfo 
   * @returns 
   */
  async addPeriod(periodInfo: PeriodFields): Promise<PeriodDocument> {
    console.log("添加开奖信息：", periodInfo);
    let periodModel = new Period({
      ...periodInfo,
    });
    return periodModel.save();
  }
  /**
   * 更新开奖信息
   * @param lotteryNumber 
   * @param periodInfo 
   * @returns 
   */
  updatePeriod(lotteryNumber: number, periodInfo: any): any {
    // console.log("更新开奖信息：", { periodInfo });
    return Period.findOneAndUpdate(
      {
        lotteryNumber: lotteryNumber,
      },
      periodInfo,
      {
        new: true,
      }
    );
  }
  /**
   * 分页获取列表
   * @param pageNum 
   * @param pageSize 
   * @returns 
   */
  getPeriodList(pageNum: number = 1, pageSize: number = 20): any {
    let limitVal = pageSize,
      skipVal = pageNum > 1 ? limitVal * (pageNum - 1) : 0;
    return Period.find({}).sort({
      createdAt: -1
    }).limit(Number(limitVal)).skip(Number(skipVal));
  }
  /**
   * 获取最后一期开奖信息
   * @returns 
   */
  getLastPeriod(): any {
    return Period.findOne({
      periodStatus: 1,
    }).sort({ _id: -1 });
  }
  getPeriodById(periodId: string): any {
    return Period.findOne({
      _id: periodId,
    });
  }
  getPeriodByNum(drawNum: number): any {
    return Period.findOne({
      lotteryNumber: drawNum,
    });
  }
})();
