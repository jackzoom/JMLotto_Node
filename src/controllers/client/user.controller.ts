import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { SignToken } from "../../utils/token";
import { AppletLogin } from "../../config/scope.config";

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
    let userDoc = {
      openId: Number(
        Math.random().toString().substr(3, 6) + +Date.now()
      ).toString(16),
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
  }
})();
