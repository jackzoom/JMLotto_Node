/**
 * 彩票开奖信息抓取
 */
import { scheduleJob, cancelJob } from "node-schedule";
import { get } from "request-promise";
import logger from "../utils/logger";
import PeriodController from "../controllers/client/period.controller";
import TicketController from "../controllers/client/ticket.controller";
import { formatTime, getGUID } from "../utils";
import { PeriodDocument } from "../models/period.model";

// * * * * * *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │ |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每周一、三、六 20:25 爬取开奖信息
// 转换时间：UTC -> Beijing = -8  =>> 12:50
export default class PeriodSchedule {
  jobId: string = getGUID();
  job: any;
  constructor() {
    this.close = this.close.bind(this);
    this.start = this.start.bind(this);
    this.init();
  }
  init() {
    this.dataCrawler().then(() => {});
    this.job = this.start(this.jobId);
  }
  start(jobId: string) {
    return scheduleJob(
      jobId,
      { hour: "12", minute: "30", dayOfWeek: [1, 3, 6] },
      () => {
        //1. 抓取开奖信息
        //2. 创建下期开奖信息
        logger.info(`执行开奖爬取`);
        this.dataCrawler().then((res) => {
          this.eventHandle();
        });
      }
    );
  }
  close() {
    cancelJob(this.jobId);
  }
  /**
   * 开奖后事件处理
   */
  eventHandle = () => {
    //轮循数据库
    TicketController.pollingTicket();
    //自动追加下一期
    PeriodController.addNextPeriodByAuto().catch((err) => {
      //库中可能已存在下一期
      if (err.code !== 11000) {
        console.log("自动追加下期开奖Catch：", err.message);
      }
    });
  };
  /**
   * 抓取体彩大乐透最后一期开奖信息
   * @returns
   */
  async dataCrawler(): Promise<PeriodDocument | void> {
    return new Promise((resolve: any, reject: any) => {
      let baseUrl = `https://webapi.sporttery.cn/gateway/lottery/getDigitalDrawInfoV1.qry?param=85,0&isVerify=0`;
      get(baseUrl, {
        json: true,
      })
        .then((res) => {
          let { success, value } = res;
          if (!success) {
            //接口爬取数据返回异常
            //TODO：邮件通知管理员
            return logger.error(`开奖数据爬取解析异常`);
          }
          let lottoData = value.dlt;
          PeriodController.updateDrawResult({
            drawNum: lottoData.lotteryDrawNum,
            drawResult: lottoData.lotteryDrawResult,
            drawResultUnsort: lottoData.lotteryUnsortDrawresult,
            drawTime: lottoData.lotteryDrawTime,
            saleBeginTime: lottoData.lotterySaleBeginTime,
            saleEndTime: lottoData.lotterySaleEndtime,
          })
            .then((res) => {
              //任务更新成功
              logger.info("开奖更新成功：" + res.lotteryNumber);
              this.eventHandle();
              resolve(res);
            })
            .catch(async (err) => {
              if (err.code === 11000) {
                let res = await PeriodController.getPeriodByNum(
                  lottoData.lotteryDrawNum
                );
                return resolve(res);
              }
              //更新失败
              //TODO：邮件通知管理员
              logger.error(`开奖信息更新失败：${err}`);
            });
        })
        .catch(() => {
          //TODO：邮件通知管理员
          logger.error(`开奖数据爬取异常`);
        });
    });
  }
}
