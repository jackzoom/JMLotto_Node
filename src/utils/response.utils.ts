/// <reference path="../interface/response.interface.ts" />

import { Response } from "express";
import logger from "./logger";
import { isDebug } from "../config/server.config";
import { ApiHttpCode } from "../config/api.config";
import { hasObjectValue } from "../utils";

/**
 * Response Success
 * @param res
 * @param data
 * @statusCode 200
 */
export const ResponseSuccess = (res: Response, data?: any) => {
  let result: HttpResponse.Success = {
    errorCode: ApiHttpCode.RequestSuccess,
    errorMsg: "success",
    data,
  };
  res.status(200).json(result);
};

/**
 * Response Server Error
 * @param res
 * @param error
 * @param statusCode
 * @default 200
 */
export const ResponseError = (
  res: Response,
  error?: HttpResponse.Exception,
  statusCode?: number
) => {
  let result: HttpResponse.Success = {
    errorCode: error.code || ApiHttpCode.RequestFail,
    errorMsg: error.message,
  };
  if (!isDebug() && !hasObjectValue(ApiHttpCode, error.code)) {
    //生产环境不抛代码异常message
    result = {
      errorCode: ApiHttpCode.RequestFail,
      errorMsg: "服务无响应，请联系管理员",
    };
  }
  res.status(statusCode || 200).send(result);
};

/**
 * Response Server Catch
 * @param res
 * @param error
 * @statusCode 500
 */
export const ResponseCatch = (
  res: Response,
  error?: HttpResponse.Exception
) => {
  let result: HttpResponse.Success = {
    errorCode: error.code || ApiHttpCode.RequestFail,
    errorMsg: error.message,
  };
  res.status(500).send(result);
  //Log Error Strack
  logger.error(error);
};

export const ResponsePaging = () => {
  let result: HttpResponse.Paging = {
    content: [],
    currentPage: 0,
    pageSize: 20,
    totalElement: 0,
    totalPages: 0,
  };
  return result;
};
