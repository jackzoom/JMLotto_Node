/**
 * 大乐透中奖号码验证
 */
import { RankResult } from "../interface/rank.interface";
import { LottoRankRules } from "../config/ticket.config";
import moment from "moment";

const jc = (m: number, n: number, mn: number) => {
  var fz = 1;
  for (var i = m; i > mn; i--) {
    fz *= i;
  }
  var fm = n;
  for (var j = 1; j < n; j++) {
    fm *= j;
  }
  return fz / fm;
};
const c = (m: number, n: number) => {
  var m = Number(m);
  var n = Number(n);
  var result;
  if (m < n || m < 0 || n < 0) {
    result = 0;
  } else if (m == n) {
    result = 1;
  } else {
    var mn = Number(m - n);
    n == 0 ? (result = 1) : (result = jc(m, n, mn));
  }
  return result;
};

/**
 * 获取投注金额
 * @param redLen 红球个数
 * @param blueLen 篮球个数
 * @param singlePrice 每注单价
 * @returns
 * @see https://www.lottery.gov.cn/dlt/ltjsq/index.html 大乐透计算器
 * @see https://static.sporttery.cn/res_1_0/tcw/default/tcdlt/num.js 大乐透计算器核心算法
 */
export const getTicketPrice = (
  redLen: number,
  blueLen: number,
  singlePrice: number = 2
): number => {
  return c(redLen, 5) * c(blueLen, 2) * singlePrice;
};

/**
 * 大乐透中奖验证
 * @param {array} redArr 奖项等级列表 5+位数组
 * @param {array} blueArr 奖项等级列表 2+位数组
 * @param {array} resultArr 中奖号码 7位数组
 */
export const verifyTicketResult = (
  redArr: Array<string>,
  blueArr: Array<string>,
  resultArr: Array<string>
): RankResult => {
  let rankNum: string = "0";
  let resultRed = resultArr.slice(0, 5);
  let resultBlue = resultArr.slice(-2);
  let redCom = [];
  let blueCom = [];
  let rankRule = {};
  for (let i in LottoRankRules) {
    let currentItem = LottoRankRules[i];
    if (currentItem.rules) {
      for (let y = 0; y < currentItem.rules.length; y++) {
        redCom = [];
        blueCom = [];
        let currentRule = currentItem.rules[y];
        for (let z = 0; z < resultRed.length; z++) {
          if (redArr.indexOf(resultRed[z]) >= 0) {
            redCom.push(resultRed[z]);
          }
        }
        for (let n = 0; n < resultBlue.length; n++) {
          if (blueArr.indexOf(resultBlue[n]) >= 0) {
            blueCom.push(resultBlue[n]);
          }
        }
        //验证中奖等级
        if (
          currentRule.blue === blueCom.length &&
          currentRule.red === redCom.length
        ) {
          rankNum = i;
          rankRule = currentRule;
        }
      }
    }
  }
  return {
    status: rankNum === "0" ? 0 : 1,
    rankNum,
    rankData: LottoRankRules[rankNum],
    rankDetail: {
      red: redCom,
      blue: blueCom,
      rule: rankRule,
    },
  };
};

/**
 * 获取下一期开奖时间
 */
export function getNextDrawDate(): Date {
  //时间必须大于当前时间
  //判断当前为周几
  let currentDays = moment().weekday();
  let res;
  switch (currentDays) {
    case 1:
    case 2:
      res = moment().day(3);
      break;
    case 3:
    case 4:
    case 5:
      res = moment().day(6);
      break;
    case 6:
    case 7:
      res = moment().day(8);
  }
  return res.hour(20).minute(50).second(0).millisecond(0).toDate();
}
