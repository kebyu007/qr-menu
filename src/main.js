import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import expHbs from "express-handlebars";
import path from "node:path";

import appConfig from "./configs/app.config.js";
import { connectDb } from "./configs/db.config.js";
import { handlebarsHelpers } from "./helpers/handlebars.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";

import authController from "./controllers/auth.controller.js";
import viewRouter from "./routers/view.router.js";
import apiRouter from "./routers/index.js";

config({ quiet: true });

// Validate required environment variables
const required = ['MONGO_URL', 'ACCESS_T_SC', 'REFRESH_T_SC'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const hbs = expHbs.create({ extname: "hbs", helpers: handlebarsHelpers });
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src", "views"));

try {
  const dbResult = await connectDb();
  console.log(dbResult);
  await authController.seedAdmins();
} catch (err) {
  console.error("Startup error:", err);
  process.exit(1);
}

app.use("/", viewRouter);
app.use("/api", apiRouter);

app.use("*splat", (req, res) =>
  res.status(404).render("404", { url: req.url }),
);
app.use(ErrorHandlerMiddleware);

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception", err);
  process.exit(1);
});

const server = app.listen(appConfig.port, () =>
  console.log("Listening on", appConfig.port),
);

process.on("unhandledRejection", (reason) => {
  console.log("Unhandled rejection:", reason);
  server.close(() => process.exit(1));
});
