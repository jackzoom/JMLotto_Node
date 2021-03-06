import express, { Application } from "express";
import session from "express-session";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { DBConfig, EnvConfig } from "./config/server.config";
import router from "./router";
import swaggerServer from "./utils/swagger";
import logger from "./utils/logger";
import "./schedule";

// Create Express server
const app: Application = express();
const PORT = EnvConfig.PORT;

// Connect to MongoDB
const mongoUrl = DBConfig.MONGODB_URI;
mongoose.Promise = bluebird;
mongoose.set("useFindAndModify", false);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err: any) => {
    logger.error(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

// Express configuration
app.set("port", PORT);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: DBConfig.SESSION_SECRET,
    store: new MongoStore({
      mongoUrl,
      mongoOptions: {
        // autoReconnect: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use(lusca.xframe("jmlotto"));
app.use(lusca.xssProtection(true));
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  //
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger Service
swaggerServer(app);

// Register Api Router
router(app);

// Add static resource directories
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

process.on("unhandledRejection", (reason, p) => {
  logger.error(`Unhandled Rejection at:${p} reason:${reason}`);
  // application specific logging, throwing an error, or other logic here
});
export default app;
