import {
  ResponseCatch,
  ResponseError,
  ResponseSuccess,
} from "../utils/response";
import { Response } from "express";

/**
 * 基础类
 */
export default class Base {
  ResponseCatch: any;
  ResponseError: any;
  ResponseSuccess: (res: Response, data?: any) => any;
  constructor() {
    this.ResponseCatch = ResponseCatch;
    this.ResponseError = ResponseError;
    this.ResponseSuccess = ResponseSuccess;
  }
}
