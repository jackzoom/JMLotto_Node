import { Period, PeriodDocument } from "../models/period.model";

interface PeriodFields {
  lotteryRedNumber: String;
  lotteryBlueNumber: String;
  lotteryResult: string;
  lotteryUnsortResult: string;
  lotteryTime: Date;
  lotteryNumber: Number;
}

interface DBI<T> {
  addPeriod(periodInfo: any): Promise<PeriodDocument>;
  getPeriodList(): any;
}

export default new (class PeriodDao<T> implements DBI<T> {
  addPeriod(periodInfo: PeriodFields): Promise<PeriodDocument> {
    let periodModel = new Period(periodInfo);
    return periodModel.save();
  }
  getPeriodList(): any {
    return Period.find();
  }
})();
