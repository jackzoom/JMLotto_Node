import { Application } from "express";
import MasterRouter from "./admin/index.router";
import ClientRouter from "./client/index.router";
import { ApiWhiteList } from "../config/api.config";
import VerifyToken from "../middleware/verifyToken.middleware";
import { AdminLogin, AppletLogin } from "../config/scope.config";
import { RequestLogger } from "../utils/logger";

export default (app: Application) => {
  // app.use(VerifyToken('/api/v1',ApiWhiteList))
  app.use(
    "/api/v1/admin",
    VerifyToken(ApiWhiteList, AdminLogin),
    RequestLogger,
    MasterRouter
  );
  app.use(
    "/api/v1/client",
    VerifyToken(ApiWhiteList, AppletLogin),
    RequestLogger,
    ClientRouter
  );
};
