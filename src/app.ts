import express from "express";
import session from "express-session";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import router from "./router";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

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
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongoUrl,
      mongoOptions: {
        // autoReconnect: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(router);

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

export default app;
