import jwtConfig from "../configs/jwt.config.js";
import jwt from "jsonwebtoken";

export const OptionalAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, jwtConfig.accessKey);
    next();
  } catch {
    
    try {
      const refresh = req.cookies?.refreshToken;
      if (refresh) {
        const payload = jwt.verify(refresh, jwtConfig.refreshKey);
        req.user = payload;
      } else {
        req.user = null;
      }
    } catch {
      req.user = null;
    }
    next();
  }
};
