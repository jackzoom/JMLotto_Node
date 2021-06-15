import { Request, Response } from "express"; // express 申明文件定义的类型
import HTTP from "request-promise";
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { SignToken } from "../../utils/token";
import { AppletLogin } from "../../config/scope.config";
import { ApiWxAppletAppID, ApiWxAppletSecret } from "../../config/api.config";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.weappLogin = this.weappLogin.bind(this);
  }

  /**
   * 小程序登录 Weapp Login
   * @route client/user/weappLogin
   * @param req
   * @param res
   */
  async weappLogin(req: Request, res: Response) {
    //1.根据Code换取小程序OpenId
    //2.查询OpenId是否存在
    //  - 存在
    //    - 返回用户信息
    //  - 不存在
    //    - 注册用户
    //    - 返回用户信息
    let { code } = req.body;
    let WxLoginUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${ApiWxAppletAppID}&secret=${ApiWxAppletSecret}&js_code=${code}&grant_type=authorization_code`;
    HTTP.get(WxLoginUrl, {
      json: true,
    })
      .then((wxRes) => {
        if (wxRes.errcode !== 0)
          return this.ResponseError(res, {
            message: `微信异常：${wxRes.errmsg}`,
          });
        let { openId, session_key } = wxRes;
        let userDoc = {
          openId,
          sessionKey: session_key,
        };
        UserDao.addUser({
          ...userDoc,
        }).then((userRes: any) => {
          let token = SignToken({
            userId: userRes.userId,
            scope: AppletLogin,
          });
          this.ResponseSuccess(res, { ...userRes, token });
        });
      })
      .catch((err) => {
        this.ResponseError(res, err);
      });
  }
})();
