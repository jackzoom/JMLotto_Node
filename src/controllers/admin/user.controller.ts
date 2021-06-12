import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import { User } from "../../models/user.model";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.getUserList = this.getUserList.bind(this);
  }
  /**
   * GetUserList
   * @group AdminUser
   * @route GET /admin/user
   * @param req
   * @param res
   */
  async getUserList(req: Request, res: Response) {
    User.find().then((data) => {
      this.ResponseSuccess(res, data);
    });
  }

  /**
   * GetUser
   * @group AdminUser
   * @route GET /admin/user/getUser
   * @param req
   * @param res
   */
  async getUser(req: Request, res: Response) {
    User.aggregate([
      {
        $match: {
          userId: req.query.userId,
        },
      },
    ]).then((data) => {
      this.ResponseSuccess(res, data);
    });
  }
})();
