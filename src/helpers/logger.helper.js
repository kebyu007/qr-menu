import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "dotenv";
import { createRequire } from "node:module";

config({ quiet: true });
const require = createRequire(import.meta.url);

const createRotatingTransport = (level) => {
  return new DailyRotateFile({
    dirname: "logs/%DATE%",
    filename: `${level}.log`,
    level,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  });
};

const transports = [
  new winston.transports.Console(),
  createRotatingTransport("error"),
  createRotatingTransport("info"),
  createRotatingTransport("debug"),
];

if (process.env.ENABLE_WINSTON_MONGO === "true" && process.env.MONGO_URL) {
  try {
    const { MongoDB } = require("winston-mongodb");
    transports.push(
      new MongoDB({
        level: "info",
        db: process.env.MONGO_URL,
        collection: "app_logs",
      }),
    );
  } catch {
    // Optional transport is not installed; file/console logging still works.
  }
}

const logger = winston.createLogger({
  levels: { error: 0, info: 1, debug: 2 },
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports,
});

export default logger;