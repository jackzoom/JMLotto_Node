/// <reference path="../interface/response.interface.ts" />

import {
  ResponseCatch,
  ResponseError,
  ResponseSuccess,
  ResponsePaging
} from "../utils/response.utils";
import { Response } from "express";

/**
 * 基础类
 */
export default class Base {
  ResponseCatch: (res: Response, error?: HttpResponse.Exception) => void;
  ResponseError: (
    res: Response,
    error?: HttpResponse.Exception,
    statusCode?: number
  ) => void;
  ResponseSuccess: (res: Response, data?: any) => void;
  ResponsePaging: (res: Response, data: HttpResponse.Paging) => void;
  constructor() {
    this.ResponseCatch = ResponseCatch;
    this.ResponseError = ResponseError;
    this.ResponseSuccess = ResponseSuccess;
    this.ResponsePaging = ResponsePaging;
  }
}
