import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { SignToken } from "../../utils/token";
import { AdminLogin } from "../../config/scope.config";
import { UserDocument } from "../../models/user.model";

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
    let { account, password } = req.body;
    UserDao.getUserByAccount(account, password, 1).then(
      (userRes: UserDocument) => {
        if (!userRes)
          return this.ResponseError(res, {
            message: "账户密码验证错误",
          });
        let token = SignToken({
          userId: userRes._id,
          scope: AdminLogin,
        });

        this.ResponseSuccess(res, {
          nickName: userRes.nickName,
          token,
        });
      }
    );
  }
})();
