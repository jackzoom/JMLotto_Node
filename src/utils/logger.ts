import winston, { format } from "winston";
import expressWinston from "express-winston";
import 'winston-daily-rotate-file'
import path from "path";
import { Request, NextFunction } from "express";
import { JwtAuthResponse } from "../interface/auth.interface";

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
      format: format.combine(format.timestamp(), format.colorize(), myFormat),
    }),
    //info级别的保存在info.log文件中
    new winston.transports.File({
      filename: path.resolve(__dirname, "../logs/info.log"),
      level: "info",
    }),
    //debug级别的保存在debug.log文件中
    new winston.transports.File({
      filename: path.resolve(__dirname, "../logs/debug.log"),
      level: "debug",
    }),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

/**
 * 请求Logger
 * @description 日志文件存放在：`logs/request`
 * @param req 
 * @param res 
 * @param next 
 */
export let RequestLogger = (req: Request, res: JwtAuthResponse, next: NextFunction) => {
  let query = req.query || {}
  let body = req.body || {}
  let headers = req.headers || {};
  let authUser = res.authUser || {}
  expressWinston.logger({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: path.resolve(__dirname, "../logs/request/%DATE%.log"),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '7d'
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    dynamicMeta: (req, res): object => {
      return {
        req: {
          headers,
          query,
          body,
          authUser
        }
      }
    },
    msg() {
      return `HTTP ${req.method} ${req.url} query ${JSON.stringify(query)} body ${JSON.stringify(body)}`
    },
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: (req, res): boolean => {
      // let status = true;
      // let ignoreArr = ['/api'];
      // ignoreArr.forEach(item => {
      //   if (req.url.indexOf(item) > -1) status = false
      // })
      // return status
      return false
    }
  })(req, res, next)
}

export default logger;
