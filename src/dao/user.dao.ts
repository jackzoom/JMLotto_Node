import logger from "../utils/logger";
import { User, UserDocument } from "../models/user.model";

interface DBI<T> {
  getUserById(userId: string): Promise<UserDocument>;
  getUserByAccount(account: string, password: string, isAdmin: number): any;
  getUserList: any;
  addUser(userInfo: UserInterface): Promise<UserDocument>;
  updateUser(userId: string, userInfo: UserInterface): Promise<UserDocument>;
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
  getUserById(userId: string): any {
    return User.findById({
      _id: userId,
    }).select("+account");
  }
  getUserByAccount(
    account: string,
    password: string,
    isAdmin: number = 0
  ): any {
    return new Promise((resolve, reject) => {
      User.findOne({
        account,
        isAdmin,
        isDelete: 0
      }).select("+password").then(userDoc => {
        if (!userDoc) return reject("账户登录失败")
        userDoc.comparePassword(password, (err, isMatch) => {
          err && logger.error("账户登录异常：", err)
          if (!isMatch || err) return reject("账户登录失败")
          resolve(userDoc);
        })
      })
    })

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
  addUser(userInfo: UserInterface): Promise<UserDocument> {
    let UserModel = new User(userInfo);
    return UserModel.save();
  }
  updateUser(userId: string, userInfo: UserInterface): any {
    return User.findByIdAndUpdate(userId, userInfo)
  }
  deleteUser(userId: string): any {
    return User.findByIdAndUpdate(userId, {
      isDelete: 1
    })
  }
})();
