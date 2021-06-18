import { Period, PeriodDocument } from "../models/period.model";

interface PeriodFields {
  lotteryRedNumber: String;
  lotteryBlueNumber: String;
  lotteryResult: string;
  lotteryUnsortResult: string;
  lotteryTime: Date;
  lotteryNumber: number;
  periodStatus?: number;
}

interface DBI<T> {
  addPeriod(periodInfo: any): Promise<PeriodDocument>;
  getPeriodList(pageNum: number, pageSize: number): any;
  getLastPeriod(): any;
  getPeriodById(periodId: string): any;
}

export default new (class PeriodDao<T> implements DBI<T> {
  addPeriod(periodInfo: PeriodFields): Promise<PeriodDocument> {
    let periodModel = new Period(periodInfo);
    return periodModel.save();
  }
  getPeriodList(pageNum: number = 1, pageSize: number = 20): any {
    let limitVal = pageSize,
      skipVal = pageNum > 1 ? limitVal * (pageNum - 1) : 0;
    return Period.find({}).limit(Number(limitVal)).skip(Number(skipVal));
  }
  getLastPeriod(): any {
    return Period.findOne({}).sort({ _id: -1 });
  }
  getPeriodById(periodId: string): any {
    return Period.findOne({
      _id: periodId,
    });
  }
})();
