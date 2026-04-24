import { log } from "node:console";
import logger from "../helpers/logger.helper.js";

const API_TO_VIEW = {
  "/api/auth/login": "/login",
  "/api/auth/register": "/register",
  "/api/auth/forgot-password": "/forgot-password",
  "/api/auth/reset-password": "/reset-password",
  "/admin/categories": "/admin/categories",
  "/admin/products": "/admin/products",
  "/admin/feedback": "/admin/feedback",
  "/feedback": "/feedback",
};

export const ErrorHandlerMiddleware = (err, req, res, __) => {
  logger.error(JSON.stringify(err));
  log(err);

  const message = err.message || "Internal server error";
  const urlPath = req.url.split("?")[0];
  const existingQuery = req.url.includes("?") ? "&" + req.url.split("?")[1] : "";

  const redirectTo = API_TO_VIEW[urlPath] || urlPath;

  
  if (urlPath === "/api/auth/reset-password") {
    const { userId, signed } = req.query;
    const extra = userId ? `&userId=${userId}&signed=${signed}` : "";
    return res.redirect(`${redirectTo}?error=${encodeURIComponent(message)}${extra}`);
  }

  return res.redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
};
