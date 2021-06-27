import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import Crypto from "crypto";
import { WxMsgToken } from "../../config/api.config";

export default new (class AdminWx extends Base {
  constructor() {
    super();
    this.checkWxPushToken = this.checkWxPushToken.bind(this);
  }

  /**
   * 微信消息服务Token验证
   * @group AdminWxMsg
   * @route GET /admin/wx/checkPushMsg
   * @param req
   * @param res
   * @description
   * `开发者提交信息后，微信服务器将发送GET请求到填写的服务器URL上，GET请求携带参数如下
   * signature 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数，nonce参数
   * timestamp    时间戳
   * nonce    随机数
   * echostr    随机字符串`
   */
  async checkWxPushToken(req: Request, res: Response) {
    let { signature, timestamp, nonce, echostr } = req.query;
    let signStr = Crypto.createHash("sha1")
      .update([WxMsgToken, timestamp, nonce].sort().join(""))
      .digest("hex");

    if (signStr === signature) {
      // 如果验证成功则原封不动的返回
      res.send(echostr);
    } else {
      this.ResponseError(res, {
        message: "验证失败",
      });
    }
  }
})();
