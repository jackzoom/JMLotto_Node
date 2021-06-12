import { Application } from "express";
import MasterRouter from "./admin/index.router";
import ClientRouter from "./client/index.router";
export default (app: Application) => {
  app.use("/api/v1/admin", MasterRouter);
  app.use("/api/v1/client", ClientRouter);
};
