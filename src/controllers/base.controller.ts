import {
  ResponseCatch,
  ResponseError,
  ResponseSuccess,
} from "../utils/response.utils";
import {
  HttpResponseException  
} from "../interface/response.interface";
import { Response } from "express";

/**
 * 基础类
 */
export default class Base {
  ResponseCatch: (res: Response, error?: HttpResponseException) => void;
  ResponseError: (res: Response, error?: HttpResponseException) => void;
  ResponseSuccess: (res: Response, data?: any) => void;
  constructor() {
    this.ResponseCatch = ResponseCatch;
    this.ResponseError = ResponseError;
    this.ResponseSuccess = ResponseSuccess;
  }
}
