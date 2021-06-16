import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { User } from "../../models/user.model";
import { getGUID } from "../../utils";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.getUserList = this.getUserList.bind(this);
    this.insertTestUser = this.insertTestUser.bind(this);
  }

  
  /**
   * 添加Test用户
   * @group AdminAuth
   * @route POST /admin/user/addTestUser
   * @param req 
   * @param res 
   */
   async insertTestUser(req:Request,res:Response){
     let userDoc = {
      openId: getGUID()
    };
    UserDao.addUser({
      ...userDoc,
    }).then((userRes: any) => {
      this.ResponseSuccess(res, userRes);
    });
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
