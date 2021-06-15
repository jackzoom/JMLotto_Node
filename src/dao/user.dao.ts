import { User, UserDocument } from "../models/user.model";

interface DBI<T> {
  getUserById(userId: string): Promise<UserDocument>;
  getUserByAccount(
    account: string,
    password: string,
    isAdmin: number
  ): Promise<UserDocument>;
  addUser(userInfo: object): Promise<UserDocument>;
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
    });
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
