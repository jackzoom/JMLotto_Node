import { Request, NextFunction } from "express";
import { ResponseError } from "../utils/response.utils";
import { ApiHeaderKey } from "../config/api.config";
import { EnvConfig } from "../config/server.config";
import { VerifyToken } from "../utils/token";

export default function verifyToken(prefix: string, whiteList: Array<string>) {
  return async (req: Request, res: any, next: NextFunction) => {
    let { path } = req;
    if (
      path.indexOf(prefix) < 0 ||
      whiteList.includes(path.replace(prefix, ""))
    )
      return await next();
    try {
      const token = req.headers[ApiHeaderKey] as string;
      const user = await VerifyToken(token);
      console.log("verifyToken：", user);
      res.authUser = user;
      await next();
    } catch ({ name, message }) {
      let errorMsg = "访问无权限";
      if (name === "TokenExpiredError") {
        errorMsg = "Token已经过期";
      } else if (name === "JsonWebTokenError") {
        errorMsg = "无效的登录令牌";
      } else {
        errorMsg = EnvConfig.NODE_ENV !== "production" ? message : errorMsg;
      }
      return ResponseError(
        res,
        {
          message: errorMsg,
        },
        401
      );
    }
  };
}
