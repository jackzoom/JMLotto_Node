import { Request, Response } from "express"; // express 申明文件定义的类型
import { ResponseHandle } from "../base";

/**
 * User: getUserList
 * @route GET /admin/user
 */
export const getUserList = (req: Request, res: Response) => {
  ResponseHandle(res, req.query);
};
