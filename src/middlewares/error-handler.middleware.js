import { log } from "node:console";
import logger from "../helpers/logger.helper.js";

export const ErrorHandlerMiddleware = (err, req, res, __) => {
  logger.error(JSON.stringify(err));
  log(err);
  const isApi = req.originalUrl.startsWith("/api/");
  const status = err.status || 500;
  const acceptsHtml = req.accepts("html");
  const isFormSubmit = req.method !== "GET" && req.is("application/x-www-form-urlencoded");

  const redirectWithError = (fallbackPath, message) => {
    const referer = req.get("referer") || fallbackPath;
    const separator = referer.includes("?") ? "&" : "?";
    return res.redirect(`${referer}${separator}error=${encodeURIComponent(message)}`);
  };

  if (err.isException) {
    if (isApi && acceptsHtml && isFormSubmit) {
      return redirectWithError("/login", err.message);
    }
    if (isApi) {
      return res.status(status).json({ success: false, message: err.message });
    }

    return res.status(status).render("login", { error: err.message });
  }

  if (isApi && acceptsHtml && isFormSubmit) {
    return redirectWithError("/login", "Internal server error");
  }
  if (isApi) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }

  return res.status(500).render("login", { error: "Internal server error" });
};
