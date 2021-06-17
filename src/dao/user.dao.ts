import { User, UserDocument } from "../models/user.model";

interface DBI<T> {
  getUserById(userId: string): Promise<UserDocument>;
  getUserByAccount(account: string, password: string, isAdmin: number): any;
  getUserList: any;
  addUser(userInfo: UserInterface): Promise<UserDocument>;
  updateUser(userId: string, userInfo: T): Promise<UserDocument>;
  deleteUser(userId: string): Promise<UserDocument>;
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
    return User.findOne({
      account,
      password,
      isAdmin,
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
  addUser(userInfo: UserInterface): Promise<UserDocument> {
    let UserModel = new User(userInfo);
    return UserModel.save();
  }
  updateUser(userId: string, userInfo: T): Promise<UserDocument> {
    throw new Error("Method not implemented.");
  }
  deleteUser(userId: string): Promise<UserDocument> {
    throw new Error("Method not implemented.");
  }
})();
