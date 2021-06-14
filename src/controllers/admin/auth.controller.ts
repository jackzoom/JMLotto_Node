import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { check } from "express-validator";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.adminLogin = this.adminLogin.bind(this);
  }

  /**
   * AdminAuth
   * @group AdminAuth
   * @route POST /admin/auth/login
   * @param req
   * @param res
   */
  async adminLogin(req: Request, res: Response) {
    console.log(req.body);
    await check("account", "请输入账户名").not().isEmpty().run(req);
    await check("password", "请输入密码").not().isEmpty().run(req);
    let { account, password } = req.body;  
    UserDao.getUserByAccount(account, password).then((userRes: any) => {
      if (!userRes)
        return this.ResponseError(res, {
          message: "账户密码验证错误",
        });
      this.ResponseSuccess(res, userRes);
    });
  }
})();
