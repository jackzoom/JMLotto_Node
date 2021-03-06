import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import PeriodDao from "../../dao/period.dao";
import OrderDao from "../../dao/order.dao";
import TicketDao from "../../dao/ticket.dao"
import { formatTime } from "../../utils";
import { PeriodDocument } from "../../models/period.model";
import { getNextDrawDate } from "../../utils/ticket";
import { Types } from "mongoose";
import { JwtAuthResponse } from "../../interface/auth.interface";

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
    this.getLastPeriod = this.getLastPeriod.bind(this);
    this.addNextPeriodByAuto = this.addNextPeriodByAuto.bind(this);
    this.updateDrawResult = this.updateDrawResult.bind(this);
    this.getPeriodTicketList = this.getPeriodTicketList.bind(this);
  }

  /**
   * 获取周期列表 GetPeriodList
   * @group ClientPeriod
   * @route GET /client/period
   * @param pageNum
   * @param pageSize
   */
  async getPeriodList(req: Request, res: Response) {
    let pageNum = (req.query.pageNum || 1) as number;
    let pageSize = (req.query.pageSize || 20) as number;
    let filterParam = {};
    try {
      PeriodDao.getPeriodList(pageNum, pageSize).then(async (data: any) => {
        let total = await PeriodDao.getPeriodTotal(filterParam)
        this.ResponsePaging(res, {
          pageNum,
          pageSize,
          total,
          content: data
        });
      });
    } catch (err: any) {
      this.ResponseError(res, err);
    }

  }

  /**
   * 获取周期详情 GetPeriodDetail
   * @group ClientPeriod
   * @route GET /client/period/detail
   * @header token?
   * @param periodId
   */
  async getPeriodDetail(req: Request, res: JwtAuthResponse) {
    try {
      let periodId = req.query.periodId as string;
      let { userId } = res.authUser;
      PeriodDao.getPeriodById(periodId)
        .then(async (data: any) => {
          this.ResponseSuccess(res, {
            ...data.toJSON(),
            /** 个人投注信息 */
            userBetting: userId ? await TicketDao.getTicketListByPeriodId(periodId, userId) : null
          });
        })
        .catch((err: any) => {
          this.ResponseError(res, err);
        });
    } catch (err: any) {
      this.ResponseError(res, err);
    }

  }

  /**
   * 获取最后一期开奖信息 GetLastPeriod
   * @group ClientPeriod
   * @route GET /client/period/last
   */
  async getLastPeriod(req: Request, res: Response) {
    try {
      PeriodDao.getLastPeriod()
        .then((data: any) => {
          this.ResponseSuccess(res, data);
        })
        .catch((err: any) => {
          this.ResponseError(res, err);
        });
    } catch (err: any) {
      this.ResponseError(res, err);
    }
  }


  /**
   * 获取指定周期投注列表 GetPeriodTicketList
   * @group ClientPeriod
   * @route GET /client/period/ticket
   * @param periodId
   * @param pageNum
   * @param pageSize
   */
  async getPeriodTicketList(req: Request, res: Response) {
    let periodId = req.query.periodId as string;
    let pageNum = (req.query.pageNum || 1) as number;
    let pageSize = (req.query.pageSize || 20) as number;
    try {
      OrderDao.getOrderListByPeriodId(
        periodId,
        pageNum,
        pageSize
      ).then(async (orderList: any) => {
        let total = await OrderDao.getOrderTotal({
          periodId: Types.ObjectId(periodId)
        });
        this.ResponsePaging(res, {
          content: orderList.map((item: any) => {
            return {
              ...item,
              createTime: formatTime(item.createTime)
            }
          }),
          total,
          pageNum,
          pageSize
        });
      }).catch((err: any) => {
        this.ResponseError(res, err);
      });
    } catch (err: any) {
      this.ResponseError(res, err);
    }
  }

  /**
   * 自动添加下期开奖信息
   */
  async addNextPeriodByAuto() {
    return new Promise(async (resolve, reject) => {
      try {
        let lastPeriod = await PeriodDao.getLastPeriod();
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
        lotteryResult: drawInfo.drawResult,
        lotteryUnsortResult: drawInfo.drawResultUnsort,
        periodStatus: 1,
      };
      PeriodDao
        .updatePeriod(drawInfo.drawNum, drawParam)
        .then(async (res: any) => {
          //更新失败
          if (!res) {
            let newDoc = await PeriodDao.addPeriod({
              lotteryNumber: drawInfo.drawNum,
              ...drawParam
            });
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
      let periodRes = await PeriodDao.getPeriodByNum(drawNum);
      resolve(periodRes);
    });
  }
})();
