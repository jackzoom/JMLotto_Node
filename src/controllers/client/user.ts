import { Request, Response } from "express"; // express 申明文件定义的类型

/**
 * User: getUser
 * @route GET /getUser
 */
export const getUser = (req: Request, res: Response) => {
  res.json({
    data: {
      userName: "test",
      userId: 100001,
    },
    errorCode: "0000",
    errorMsg: "success",
  });
};
