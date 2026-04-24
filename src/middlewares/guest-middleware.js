import jwt from "jsonwebtoken";
import jwtConfig from "../configs/jwt.config.js";

export const Guest = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next();

  try {
    jwt.verify(token, jwtConfig.accessKey);
    res.redirect("/profile"); 
  } catch {
    next(); 
  }
};
