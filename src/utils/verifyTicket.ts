/**
 * 大乐透中奖号码验证
 */
import { LottoRankRules } from "../config/ticket.config"

/**
 * 返回信息
 */
type WinResult = {
    /**
     * @value 0 未中奖
     * @value 1-6 分别代表6个中奖级别
     */
    rank: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

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
}
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
}

/**
 * 获取投注金额
 * @param redLen 红球个数
 * @param blueLen 篮球个数
 * @returns 
 * @see https://www.lottery.gov.cn/dlt/ltjsq/index.html 大乐透计算器
 * @see https://static.sporttery.cn/res_1_0/tcw/default/tcdlt/num.js 大乐透计算器核心算法
 */
export const getTicketPrice = (redLen: number, blueLen: number): number => {
    return c(redLen, 5) * c(blueLen, 2) * 2
}


/**
 * 中奖号码验证
 * @param redNumbers 红球号码数组
 * @param blueNumbers 蓝球号码数组
 * @param drawResult 中奖号码组
 * @description 前5各位红球，后2各位篮球
 * @returns {object} 
 * `{rank:0}`
 */
export default function (redNumbers: Array<string>, blueNumbers: Array<string>, drawResult: Array<string>): WinResult {
    let winCode: WinResult;

    return winCode
}