import errorHandler from "errorhandler";
import app from "./app";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV !== "production") {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  let serverUrl = `App is running at ${process.env.SERVER_URL}`,
    swaggerUrl = `Api Docoment at ${process.env.SERVER_URL}/swagger`;
  console.log(serverUrl);
  console.log(swaggerUrl);
});

export default server;
