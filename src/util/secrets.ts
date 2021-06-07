import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  // logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: `.env` });
  const ENVNAME = process.env["mode"];
  if (fs.existsSync(`.env.${ENVNAME}`))
    dotenv.config({ path: `.env.${ENVNAME}` });
}

export const ENVIRONMENT = process.env["NODE_ENV"];
export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];

console.log("启动环境：", ENVIRONMENT);
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
