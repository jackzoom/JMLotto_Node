/**
 * 彩票开奖信息抓取
 */
import { scheduleJob, cancelJob } from "node-schedule";
import { get } from "request-promise";
import logger from "../utils/logger";
import PeriodController from "../controllers/client/period.controller";
import TicketController from "../controllers/client/ticket.controller";
import { getGUID } from "../utils";

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
  jobId: string;
  job: any;
  constructor() {
    this.close = this.close.bind(this);
    this.start = this.start.bind(this);
    this.init();
  }
  init() {
    let jobId = getGUID();
    this.dataCrawler();
    this.job = this.start(jobId);
    this.jobId = jobId;
  }
  start(jobId: string) {
    return scheduleJob(
      jobId,
      { hour: "20", minute: "30", dayOfWeek: [1, 3, 6] },
      () => {
        console.log("执行开奖爬取：", jobId);
        TicketController.pollingTicket();
      }
    );
  }
  close() {
    cancelJob(this.jobId);
  }
  dataCrawler() {
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
        .then((res: object) => {
          //任务更新成功
          logger.info("开奖更新成功：" + res);
          TicketController.pollingTicket();
        })
        .catch((err) => {
          //更新失败
          logger.error(`开奖信息更新失败：${err}`);
          TicketController.pollingTicket();
        });
    });
  }
}
