import winston from "winston";
import path from "path";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
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

export default logger;
