export interface RankResult {
  /**
   * 中奖状态
   */
  status: 0 | 1 | 2;
  /**
   * 中奖等级
   */
  rankNum: String;
  /**
   * 中奖信息
   */
  rankData: Object;
  /**
   * 中奖号码详情
   */
  rankDetail: {
    red: Array<String>;
    blue: Array<String>;
    rule: Object;
  };
}
