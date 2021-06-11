import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base";
import { User } from "../../models/user";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.weappLogin = this.weappLogin.bind(this);
  }

  /**
   * Weapp Login
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

    User.findOne({
      openId: "mock openId",
    }).then((data) => {
      console.log("微信Code登录：", data);
      this.ResponseSuccess(res, data);
    });
  }
})();
