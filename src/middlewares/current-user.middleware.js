import jwt from "jsonwebtoken";
import jwtConfig from "../configs/jwt.config.js";

export const CurrentUserMiddleware = (req, res, next) => {
  const token = req.cookies?.accessToken;
  res.locals.currentUser = null;

  if (!token) return next();

  try {
    const payload = jwt.verify(token, jwtConfig.accessKey);
    res.locals.currentUser = payload;
  } catch {
    res.locals.currentUser = null;
  }

  next();
};
