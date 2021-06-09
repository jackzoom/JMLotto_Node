import { Application } from "express";
import MasterRouter from "./admin";
import ClientRouter from "./client";
export default (app: Application) => {
  app.use("/api/v1/admin", MasterRouter);
  app.use("/api/v1/client", ClientRouter);
};
