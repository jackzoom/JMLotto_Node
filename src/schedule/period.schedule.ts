/**
 * 彩票开奖信息抓取
 */
import { scheduleJob, cancelJob } from "node-schedule";
import { get } from "request-promise";
import logger from "../utils/logger";
import PeriodController from "../controllers/client/period.controller";
import TicketController from "../controllers/client/ticket.controller";
import { getGUID } from "../utils";
import { PeriodDocument } from "../models/period.model";
import periodController from "../controllers/client/period.controller";

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
      { hour: "20", minute: "30", dayOfWeek: [1, 3, 6] },
      () => {
        console.log("执行开奖爬取：", jobId);
        this.dataCrawler().then(() => {
          //轮循数据库
          TicketController.pollingTicket();
        });
      }
    );
  }
  close() {
    cancelJob(this.jobId);
  }
  /**
   * 抓取体彩大乐透最后一期开奖信息
   * @returns
   */
  async dataCrawler(): Promise<PeriodDocument | void> {
    return new Promise((resolve: any, reject: any) => {
      let baseUrl = `https://webapi.sporttery.cn/gateway/lottery/getDigitalDrawInfoV1.qry?param=85,0&isVerify=0`;
      get(baseUrl, {
        json: true,
      }).then((res) => {
        let { success, value } = res;
        if (!success) {
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
            logger.info("开奖更新成功：" + res);
            resolve(res);
          })
          .catch(async (err) => {         
            if (err.code === 11000) {
              let res = await periodController.getPeriodByNum(
                lottoData.lotteryDrawNum
              );
              return resolve(res);
            }
            //更新失败
            //TODO：邮件通知管理员
            logger.error(`开奖信息更新失败：${err}`);
          });
      });
    });
  }
}
