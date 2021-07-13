import { Request, Response } from "express";
import HTTP from "request-promise";
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { SignToken } from "../../utils/token";
import { AppletLogin } from "../../config/scope.config";
import {
  ApiHttpCode,
  ApiWxAppletAppID,
  ApiWxAppletSecret,
} from "../../config/api.config";
import { JwtAuthResponse } from "../../interface/auth.interface";
import { UserDocument } from "../../models/user.model";
import { Types } from "mongoose";
export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.weappLogin = this.weappLogin.bind(this);
    this.accountLogin = this.accountLogin.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserAggregate = this.getUserAggregate.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  /**
   * 小程序登录 Weapp Login
   * @route client/user/weappLogin
   * @param code
   * @param userInfo 微信用户信息
   */
  async weappLogin(req: Request, res: Response): Promise<void> {
    //1.根据Code换取小程序OpenId
    //2.查询OpenId是否存在
    //  - 存在
    //    - 返回用户信息
    //  - 不存在
    //    - 注册用户
    //    - 返回用户信息
    let { code, userInfo } = req.body;
    let result;
    let WxLoginUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${ApiWxAppletAppID}&secret=${ApiWxAppletSecret}&js_code=${code}&grant_type=authorization_code`;
    HTTP.get(WxLoginUrl, {
      json: true,
    })
      .then(async (wxRes) => {
        if (wxRes.errcode === 0) {
          console.log("微信登录异常：", wxRes);
          return this.ResponseError(res, {
            message: `微信异常：${wxRes.errmsg}`,
          });
        }
        let { openid, session_key } = wxRes;
        //验证OpenId是否存在
        result = await UserDao.getUserByOpenId(openid, session_key);
        if (result) {
          return this.ResponseSuccess(res, {
            token: SignToken({
              userId: result._id,
              scope: AppletLogin,
            }),
          });
        }
        let userDoc = {
          openId: openid,
          sessionKey: session_key,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city,
          language: userInfo.language
        };
        UserDao.addUser({
          ...userDoc,
        }).then((userRes: any) => {
          let token = SignToken({
            userId: userRes._id,
            scope: AppletLogin,
          });
          console.log("微信注册用户：", userRes);
          this.ResponseSuccess(res, { token, nickName: userRes.nickName });
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
    UserDao.getUserByAccount(account, password, 0)
      .then((userRes: UserDocument) => {
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
      })
      .catch((err: any) => {
        this.ResponseError(res, err);
      });
  }

  /**
   * 获取用户信息
   * @route /client/user/getUser
   * @header token
   */
  async getUser(req: Request, res: JwtAuthResponse): Promise<void> {
    UserDao.getUserById(res.authUser.userId).then((doc: UserDocument) => {
      if (!doc) {
        return this.ResponseError(
          res,
          {
            message: "用户不存在",
          },
          ApiHttpCode.AuthFail
        );
      }
      this.ResponseSuccess(res, doc);
    }).catch((err: any) => {
      this.ResponseError(res, err)
    })
  }

  /**
   * 获取用户聚合数据
   * @route /client/user/aggregate
   * @header token
   */
  async getUserAggregate(req: Request, res: JwtAuthResponse): Promise<void> {
    UserDao.getUserAggregate(res.authUser.userId).then((doc: any) => {
      this.ResponseSuccess(res, doc[0]);
    }).catch((err: any) => {
      this.ResponseError(res, err)
    })
  }


  /**
   * 更新用户信息
   * @route /client/user/update
   * @header token
   */
  async updateUser(req: Request, res: JwtAuthResponse): Promise<void> {
    let bodys = req.body;
    let params = {
      avatarUrl: bodys.avatarUrl,
      nickName: bodys.nickName,
      gender: bodys.gender,
      country: bodys.country,
      province: bodys.province,
      city: bodys.city,
      language: bodys.language,
      phoneNumber: bodys.phoneNumber,
      countryCode: bodys.countryCode,
      // openId: string;
      // unionId: string;
      // password: string;
      // sessionKey: string;
      // lastLogin: Date;
      // parentId: string;
      // isAdmin: number;
      // isDelete: number;
    };
    UserDao.updateUser(res.authUser.userId, params).then(
      (doc: UserDocument) => {
        if (!doc) {
          return this.ResponseError(
            res,
            {
              message: "用户不存在",
            },
            ApiHttpCode.AuthFail
          );
        }
        this.ResponseSuccess(res, doc);
      }
    ).catch((err: any) => {
      this.ResponseError(res, err)
    })
  }
})();
