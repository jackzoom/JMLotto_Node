import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import PeriodDao from "../../dao/period.dao";
import periodDao from "../../dao/period.dao";
import logger from "../../utils/logger";
import { formatTime } from "../../utils";
import { PeriodDocument } from "../../models/period.model";
import { getNextDrawDate } from "../../utils/ticket";

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
    this.getPeriodDetail = this.getPeriodDetail.bind(this);
    this.addNextPeriodByAuto = this.addNextPeriodByAuto.bind(this);
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
    let pageNum = (req.query.pageNum || 1) as number;
    let pageSize = (req.query.pageSize || 20) as number;
    PeriodDao.getPeriodList(pageNum, pageSize).then((data: any) => {
      this.ResponseSuccess(res, data);
    });
  }

  /**
   * 获取周期详情 GetPeriodDetail
   * @group ClientPeriod
   * @route GET /client/period/detail
   * @param req
   * @param res
   */
  async getPeriodDetail(req: Request, res: Response) {
    let { periodId } = req.query;
    PeriodDao.getPeriodById(periodId as string)
      .then((data: any) => {
        this.ResponseSuccess(res, data);
      })
      .catch((err: any) => {
        this.ResponseError(res, err);
      });
  }

  /**
   * 自动添加下期开奖信息
   */
  async addNextPeriodByAuto() {
    return new Promise(async (resolve, reject) => {
      try {
        let lastPeriod = await periodDao.getLastPeriod();
        if (lastPeriod.periodStatus === 0) {
          return resolve(lastPeriod);
        }
        let lastNum = (lastPeriod.lotteryNumber + 1) as number;
        let nextIsExist = await PeriodDao.getPeriodByNum(lastNum);
        if (nextIsExist) return resolve(nextIsExist);
        let newPeriod = await PeriodDao.addPeriod({
          lotteryNumber: lastNum,
          lotteryTime: getNextDrawDate(),
        });
        resolve(newPeriod);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 更新开奖信息
   * @param drawInfo
   */
  async updateDrawResult(drawInfo: DrawParams): Promise<PeriodDocument> {
    return new Promise((resolve, reject) => {
      let drawResultArr = drawInfo.drawResult.split(" ");
      let drawParam = {
        lotteryRedNumber: drawResultArr.slice(0, -2).join(","),
        lotteryBlueNumber: drawResultArr.slice(-2).join(","),
        lotteryRealTime: new Date(drawInfo.drawTime),
        lotteryNumber: drawInfo.drawNum,
        lotteryResult: drawInfo.drawResult,
        lotteryUnsortResult: drawInfo.drawResultUnsort,
        periodStatus: 1,
      };
      periodDao
        .updatePeriod(drawParam)
        .then(async (res: any) => {
          //更新失败
          if (!res) {
            let newDoc = await periodDao.addPeriod(drawParam);
            return resolve(newDoc);
          }
          resolve(res);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  /**
   * 获取指定期开奖信息
   */
  async getPeriodByNum(drawNum: number): Promise<PeriodDocument> {
    return new Promise(async (resolve, reject) => {
      let periodRes = await periodDao.getPeriodByNum(drawNum);
      resolve(periodRes);
    });
  }
})();
