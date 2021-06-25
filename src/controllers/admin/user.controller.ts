import { Request, Response } from "express"; // express 申明文件定义的类型
import Base from "../base.controller";
import UserDao from "../../dao/user.dao";
import { getGUID } from "../../utils";
import logger from "../../utils/logger";
import { JwtAuthResponse } from "../../interface/auth.interface";

export default new (class AdminUser extends Base {
  constructor() {
    super();
    this.getUser = this.getUser.bind(this);
    this.getUserList = this.getUserList.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.insertTestUser = this.insertTestUser.bind(this);
  }

  /**
   * 添加Test用户
   * @group AdminAuth
   * @route POST /admin/user/addTestUser
   * @param req
   * @param res
   */
  async insertTestUser(req: Request, res: Response) {
    let { account, password, isAdmin, parentId } = req.body;
    let userDoc = {
      openId: getGUID(),
      account,
      password,
      isAdmin,
      parentId
    };
    UserDao.addUser({
      ...userDoc,
    })
      .then((userRes: any) => {
        this.ResponseSuccess(res, userRes);
      })
      .catch((err) => {
        logger.error("添加Test用户失败：", err);
        this.ResponseError(res, err);
      });
  }

  /**
   * 获取用户列表 GetUserList
   * @group AdminUser
   * @route GET /admin/user
   * @param req
   * @param res
   */
  async getUserList(req: Request, res: Response) {
    UserDao.getUserList(0).then((data: any) => {
      this.ResponseSuccess(res, data);
    }).catch((err: any) => {
      this.ResponseError(res, err);
    });
  }

  /**
   * 删除用户 DeleteUser
   * @group AdminUser
   * @route GET /admin/user
   * @param req 
   * @param res 
   */
  async deleteUser(req: Request, res: Response) {
    let { userId } = req.params;
    UserDao.deleteUser(userId).then((data: any) => {
      this.ResponseSuccess(res, data);
    }).catch((err: any) => {
      this.ResponseError(res, err);
    });
  }

  /**
   * GetUser
   * @group AdminUser
   * @route GET /admin/user/getUser
   * @param req
   * @param res
   */
  async getUser(req: Request, res: JwtAuthResponse) {
    let { userId } = res.authUser;
    UserDao.getUserById(userId).then((data: any) => {
      this.ResponseSuccess(res, data);
    });
  }
})();
