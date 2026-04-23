import { log } from "node:console";
import logger from "../helpers/logger.helper.js";

export const ErrorHandlerMiddleware = (err, _, res, __) => {
  logger.error(JSON.stringify(err));

  log(err)

  if (err.isException) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).send({
    success: false,
    message: "Internal server error",
  });
};
