import { Response } from "express";
/**
 * Base Controller
 */

interface R {
  errorCode: string | number;
  errorMsg: string;
  data?: any;
}

export const ResponseHandle = (res: Response, data?: any) => {
  let result: R = {
    errorCode: "0000",
    errorMsg: "success",
    data,
  };
  res.json(result);
};
