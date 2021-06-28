import { DBInterface, EnvInterface } from "../interface/config.interface";
import logger from "../utils/logger";
import * as dotenv from 'dotenv'
import fs from "fs";

if (fs.existsSync(".env")) {
  // logger.debug("Using .env file to supply config environment variables");
  dotenv.config({
    path: '.env', encoding: "utf8",
    debug: true
  });
  const ENVNAME = process.env["mode"];
  if (fs.existsSync(`.env.${ENVNAME}`)) {
    dotenv.config({
      path: `.env.${ENVNAME}`, encoding: "utf8",
      debug: true,
    });
  }
}
console.log("启动：", process.env["SESSION_SECRET"])
const ENVIRONMENT = process.env["NODE_ENV"];
const SESSION_SECRET = process.env["SESSION_SECRET"];
const MONGODB_URI = process.env["MONGODB_URI"];

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error(
    "No mongo connection string. Set MONGODB_URI environment variable."
  );
  process.exit(1);
}

export const EnvConfig: EnvInterface = {
  PORT: (process.env.PORT || 3000) as number,
  NODE_ENV: ENVIRONMENT,
};

/**
 * 当前环境是否为开发模式
 * @returns `true | false`
 */
export const isDebug = (): boolean => ENVIRONMENT !== "production";

export const DBConfig: DBInterface = {
  MONGODB_URI,
  SESSION_SECRET,
};
