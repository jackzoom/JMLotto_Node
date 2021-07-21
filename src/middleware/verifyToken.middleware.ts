import { Request, NextFunction } from "express";
import { ResponseError } from "../utils/response.utils";
import { ApiHeaderKey, ApiHttpCode } from "../config/api.config";
import { isDebug } from "../config/server.config";
import { VerifyToken } from "../utils/token";
import { JwtAuthResponse } from "../interface/auth.interface";

export default function verifyToken(whiteList: Array<string>, scope?: string) {
  return async (req: Request, res: JwtAuthResponse, next: NextFunction) => {
    let { path } = req;
    try {
      const token = req.headers[ApiHeaderKey] as string;
      if (whiteList.includes(path)) {
        try {
          //当Token失效时，依旧返回请求内容，而不是抛出Token错误
          let user = token ? await VerifyToken(token) : {};
          res.authUser = user;
          return await next();
        } catch (e) {
          console.log("白名单Token验证异常：", e)
          return await next();
        }
      } else {
        const user = (await VerifyToken(token)) as any;
        res.authUser = user;
        if (user.scope !== scope) {
          return ResponseError(
            res,
            {
              message: "访问无权限",
            },
            ApiHttpCode.AuthFail
          );
        }
        await next();
      }
    } catch ({ name, message }) {
      let errorMsg = "访问无权限";
      if (name === "TokenExpiredError") {
        errorMsg = "Token已经过期";
      } else if (name === "JsonWebTokenError") {
        errorMsg = "无效的登录令牌";
      } else {
        errorMsg = isDebug() ? message : errorMsg;
      }
      return ResponseError(
        res,
        {
          message: errorMsg,
        },
        ApiHttpCode.Unauthorized
      );
    }
  };
}
