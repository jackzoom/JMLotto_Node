/**
 * 奖项级别信息
 * @see https://www.lottery.gov.cn/dlt/ltjsq/index.html
 */
export const LottoRankRules = {
    0: {
        name: "未中奖",
        bonus: "",
        bonusUnit: ""
    }, 1: {
        name: "一等奖",
        bonus: 33,//TODO：暂时按照最低标准
        bonusUnit: "%",
        rules: [{
            blue: 2,
            red: 5
        }]
    }, 2: {
        name: "二等奖",
        bonus: 18,
        bonusUnit: "%",
        rules: [{
            blue: 1,
            red: 5
        }]
    }, 3: {
        name: "三等奖",
        bonus: 10000,
        bonusUnit: "￥",
        rules: [{
            blue: 0,
            red: 5
        }]
    }, 4: {
        name: "四等奖",
        bonus: 3000,
        bonusUnit: "￥",
        rules: [{
            blue: 2,
            red: 4
        }]
    }, 5: {
        name: "五等奖",
        bonus: 300,
        bonusUnit: "￥",
        rules: [{
            blue: 1,
            red: 4
        }]
    }, 6: {
        name: "六等奖",
        bonus: 200,
        bonusUnit: "￥",
        rules: [{
            blue: 2,
            red: 3
        }]
    }, 7: {
        name: "七等奖",
        bonus: 100,
        bonusUnit: "￥",
        rules: [{
            blue: 0,
            red: 4
        }]
    }, 8: {
        name: "八等奖",
        bonus: 15,
        bonusUnit: "￥",
        rules: [{
            blue: 1,
            red: 3
        }, {
            blue: 2,
            red: 2
        }]
    }, 9: {
        name: "九等奖",
        bonus: 5,
        bonusUnit: "￥",
        rules: [{
            blue: 0,
            red: 3
        }, {
            blue: 1,
            red: 2
        }, {
            blue: 2,
            red: 1
        }, {
            blue: 2,
            red: 0
        }]
    }
}