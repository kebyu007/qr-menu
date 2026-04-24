import express from "express";
import appConfig from "./configs/app.config.js";
import { connectDb } from "./configs/db.config.js";
import apiRouter from "./routers/index.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware.js";
import path from "node:path";
import authController from "./controllers/auth.controller.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import expHbs from "express-handlebars";
import { handlebarsHelpers } from "./helpers/handlebars.js";
import viewRouter from "./routers/view.router.js";

config({ quiet: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(CurrentUserMiddleware);
app.use((req, res, next) => {
  res.locals.error = req.query.error;
  res.locals.message = req.query.message;
  next();
});

const hbs = expHbs.create({ extname: "hbs", helpers: handlebarsHelpers });
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDb()
  .then((res) => console.log(res))
  .catch((err) => console.log(err.message));

await authController.seedAdmins();

app.use("/", viewRouter);

// ── API ROUTES ───────────────────────────────
app.use("/api", apiRouter);

app.use("*splat", (req, res) => {
  res.status(404).render("not-found");
});

app.use(ErrorHandlerMiddleware);

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception", err);
  process.exit(1);
});

const server = app.listen(appConfig.port, () => {
  console.log("Listening on", appConfig.port);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled rejection: ${reason}`);
  server.close(() => process.exit(1));
});
