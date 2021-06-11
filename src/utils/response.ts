import { Response } from "express";
import {
  HttpResponse,
  HttpResponseException,
} from "../interface/response.interface";
import logger from "../utils/logger";

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
  res.status(200);
  res.json(result);
};

/**
 * Response Server Error
 * @param res
 * @statusCode 500
 */
export const ResponseError = (res: Response, error?: HttpResponseException) => {
  let result: HttpResponse = {
    errorCode: "0001",
    errorMsg: error.message,
  };
  res.status(500);
  res.send(result);
  //Log Error Strack
  logger.error(error);
};

/**
 * Response Server Catch
 * @param res
 * @statusCode 500
 */
export const ResponseCatch = (res: Response, error?: HttpResponseException) => {
  let result: HttpResponse = {
    errorCode: "0001",
    errorMsg: error.message,
  };
  res.status(500);
  res.send(result);
};