import { Response } from "express";
import {
  HttpResponse,
  HttpResponseException,
} from "../interface/response.interface";
import logger from "./logger";

/**
 * Response Success
 * @param res
 * @param data
 * @statusCode 200
 */
export const ResponseSuccess = (res: Response, data?: any) => {
  let result: HttpResponse = {
    errorCode: "0000",
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
  error?: HttpResponseException,
  statusCode?: number
) => {
  let result: HttpResponse = {
    errorCode: error.code || "0001",
    errorMsg: error.message,
  };
  res.status(statusCode || 200).send(result);
};

/**
 * Response Server Catch
 * @param res
 * @param error
 * @statusCode 500
 */
export const ResponseCatch = (res: Response, error?: HttpResponseException) => {
  let result: HttpResponse = {
    errorCode: error.code || "0001",
    errorMsg: error.message,
  };
  res.status(500).send(result);
  //Log Error Strack
  logger.error(error);
};
