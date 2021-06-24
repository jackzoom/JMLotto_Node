import { Request, Response } from "express";
import HTTP from "request-promise";
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { SignToken } from "../../utils/token";
import { AppletLogin } from "../../config/scope.config";
import { ApiWxAppletAppID, ApiWxAppletSecret } from "../../config/api.config";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { UserDocument } from "../../models/user.model";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.weappLogin = this.weappLogin.bind(this);
    this.accountLogin = this.accountLogin.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  /**
   * 小程序登录 Weapp Login
   * @route client/user/weappLogin
   * @param code
   * @param iv 微信声明
   * @param encryptedData 微信加密数据
   */
  async weappLogin(req: Request, res: Response): Promise<void> {
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

  /**
   * 账户密码登录
   * @route POST /client/user/accountLogin
   * @param req
   * @param res
   */
  async accountLogin(req: Request, res: Response) {
    let { account, password } = req.body;
    UserDao.getUserByAccount(account, password, 0).then(
      (userRes: UserDocument) => {
        if (!userRes)
          return this.ResponseError(res, {
            message: "账户密码验证错误",
          });
        let token = SignToken({
          userId: userRes._id,
          scope: AppletLogin,
        });

        this.ResponseSuccess(res, {
          nickName: userRes.nickName,
          token,
        });
      }
    ).catch((err: any) => {
      this.ResponseError(res, {
        message: err
      })
    })
  }

  /**
   * 获取用户信息
   * @route /client/user/getUser
   * @header token
   */
  async getUser(req: Request, res: JwtAuthResponse): Promise<void> {
    UserDao.getUserById(res.authUser.userId).then((doc: UserDocument) => {
      this.ResponseSuccess(res, doc);
    });
  }
})();
