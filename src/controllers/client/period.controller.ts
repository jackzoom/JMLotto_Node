import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import PeriodDao from "../../dao/period.dao";
import periodDao from "../../dao/period.dao";
import logger from "../../utils/logger";
import { formatTime } from "../../utils";

type DrawParams = {
  /**
   * 开奖结果
   */
  drawResult: string;
  /**
   * 开奖未排序结果
   */
  drawResultUnsort: string;
  /**
   * 开奖时间
   */
  drawTime: string;
  /**
   * 开奖期号
   */
  drawNum: number;
  /**
   * 当前期开卖时间
   */
  saleBeginTime: Date;
  /**
   * 当前期停售时间
   */
  saleEndTime: Date;
};

export default new (class ClientPeriod extends Base {
  constructor() {
    super();
    this.getPeriodList = this.getPeriodList.bind(this);
    this.updateDrawResult = this.updateDrawResult.bind(this);    
  }

  /**
   * 获取周期列表 GetPeriodList
   * @group ClientPeriod
   * @route GET /client/period
   * @param req
   * @param res
   */
  async getPeriodList(req: Request, res: Response) {
    PeriodDao.getPeriodList().then((data: any) => {
      this.ResponseSuccess(res, data);
    });
  }

  /**
   * 更新开奖信息
   * @param drawInfo
   */
  async updateDrawResult(drawInfo: DrawParams): Promise<Object> {
    return new Promise((resolve, reject) => {
      let drawResultArr = drawInfo.drawResult.split(" ");
      periodDao
        .addPeriod({
          lotteryRedNumber: drawResultArr.slice(0, -2).join(","),
          lotteryBlueNumber: drawResultArr.slice(-2).join(","),
          lotteryTime: new Date(drawInfo.drawTime),
          lotteryNumber: drawInfo.drawNum,
          lotteryResult: drawInfo.drawResult,
          lotteryUnsortResult: drawInfo.drawResultUnsort,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
})();
