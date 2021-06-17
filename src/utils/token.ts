import jwt from "jsonwebtoken";
import { ApiHttpCode } from "../config/api.config";
import { ApiJWTSecretKey } from "../config/api.config";
const { AdminLogin } = require("../config/scope.config");

interface SignData {
  timestamp: number;
  userId?: string;
  scope?: string;
}

/**
 * JWT签名
 * @param {Object} data
 * @param {Number} expiresIn 有效期:秒 `default:60*60*2`
 *
 */
export const SignToken = (data: object | SignData, expiresIn = 60 * 60 * 2) => {
  let content: SignData = {
    timestamp: Math.floor(Date.now() / 1000), //时间戳
    scope: "", //验证范围
  };
  let signData = Object.assign(content, data);
  return jwt.sign(signData, ApiJWTSecretKey, {
    expiresIn,
  });
};

/**
 * JWT验证
 * @param {String} token 令牌
 * @param {String} scope 应用范围
 * @description scope：管理员享有所有权限
 */
export const VerifyToken = async (
  token: string,
  scope?: string
): Promise<Object> => {
  return new Promise((resolve, reject) => {
    try {
      let result = {
        code: ApiHttpCode.Unauthorized,
        message: "未授权的访问",
      };
      if (!token) return reject(result);
      jwt.verify(token, ApiJWTSecretKey, (error, decoded: SignData) => {
        if (error) {
          switch (error.name) {
            case "TokenExpiredError":
              result.message = "令牌已过期";
              break;
            case "JsonWebTokenError":
              result.message = "无效的令牌";
              break;
            default:
              result.message = "令牌验证失败";
              break;
          }
          reject(result);
        } else {
          if (
            scope &&
            (decoded.scope as string) !== scope &&
            decoded.scope !== AdminLogin
          ) {
            //验证管理员
            return reject({
              message: "权限不足",
            });
          }
          resolve(decoded);
        }
      });
    } catch (err) {
      reject({
        message: err.message,
      });
    }
  });
};
