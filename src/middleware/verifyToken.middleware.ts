import { Request, NextFunction } from "express";
import { ResponseError } from "../utils/response.utils";
import { ApiHeaderKey, ApiHttpCode } from "../config/api.config";
import { isDebug } from "../config/server.config";
import { VerifyToken } from "../utils/token";
import { JwtAuthResponse } from "../interface/auth.interface";

export default function verifyToken(whiteList: Array<string>, scope?: string) {
  return async (req: Request, res: JwtAuthResponse, next: NextFunction) => {
    let { path } = req;
    if (whiteList.includes(path)) return await next();
    try {
      const token = req.headers[ApiHeaderKey] as string;
      const user = (await VerifyToken(token)) as any;
      console.log("verifyToken：", user);
      if (user.scope !== scope) {
        return ResponseError(
          res,
          {
            message: "访问无权限",
          },
          ApiHttpCode.AuthFail
        );
      }
      res.authUser = user;
      await next();
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
