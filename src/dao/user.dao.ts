import logger from "../utils/logger";
import { User, UserDocument } from "../models/user.model";
import { Types } from "mongoose";

interface DBI<T> {
  getUserById(userId: string): Promise<UserDocument>;
  getUserByOpenId(openId: string, sessionKey: string): Promise<UserDocument>;
  getUserByAccount(account: string, password: string, isAdmin: number): any;
  getUserList: any;
  addUser(userInfo: UserInterface): Promise<UserDocument>;
  updateUser(userId: string, userInfo: object): Promise<UserDocument>;
  deleteUser(userId: string): Promise<any>;
}

interface UserInterface {
  openId: string;
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  country?: string;
  province?: string;
  city?: string;
  language?: string;
  unionId?: string;
  phoneNumber?: number;
  countryCode?: number;
  password?: string;
  sessionKey?: string;
  lastLogin?: Date;
  createTime?: Date;
  parentId?: string;
}

export default new (class UserDao<T> implements DBI<T> {
  /**
   * 根据用户ID
   * @summary 获取用户信息
   * @param userId
   * @returns 
   */
  getUserById(userId: string): any {
    return User.findById({
      _id: Types.ObjectId(userId),
    }).select("+account");
  }
  /**
   * 根据微信OpenId
   * @summary 获取用户信息
   * @param openId
   * @param sessionKey
   * @returns
   */
  getUserByOpenId(openId: string, sessionKey: string): any {
    return User.findOneAndUpdate(
      {
        openId,
      },
      {
        sessionKey,
      }
    ).select("+account");
  }
  /**
   * 根据账户密码
   * @summary 获取用户信息
   * @param account
   * @param password
   * @param isAdmin
   * @returns
   */
  getUserByAccount(
    account: string,
    password: string,
    isAdmin: number = 0
  ): any {
    return new Promise((resolve, reject) => {
      User.findOne({
        account,
        isAdmin,
        isDelete: 0,
      })
        .select("+password")
        .then((userDoc) => {
          if (!userDoc) return reject("账户登录失败");
          userDoc.comparePassword(password, (err, isMatch) => {
            err && logger.error("账户登录异常：", err);
            if (!isMatch || err) return reject("账户登录失败");
            resolve(userDoc);
          });
        });
    });
  }
  /**
   * 获取所有用户
   * @param {number} isAdmin 是否为管理员
   * @returns
   */
  getUserList(isAdmin: number = 0): any {
    return User.find({
      isAdmin,
    }).select("+account");
  }
  /**
   * 添加用户
   * @param userInfo 
   * @returns 
   */
  addUser(userInfo: UserInterface): Promise<UserDocument> {
    console.log("插入用户：", userInfo);
    let UserModel = new User(userInfo);
    return UserModel.save();
  }
  /**
   * 根据用户ID更新用户信息
   * @param userId 
   * @param userInfo 
   * @returns 
   */
  updateUser(userId: string, userInfo: object): any {
    return User.findByIdAndUpdate(Types.ObjectId(userId), userInfo);
  }
  /**
   * 根据用户ID删除用户
   * @param userId 
   * @returns 
   */
  deleteUser(userId: string): any {
    return User.findByIdAndUpdate(Types.ObjectId(userId), {
      isDelete: 1,
    });
  }
})();
