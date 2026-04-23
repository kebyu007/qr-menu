import jwtConfig from "../configs/jwt.config.js";
import jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { config } from "dotenv";
import { UnauthorizedException } from "../exceptions/unathorized.exception.js";

config({ quiet: true });

export const Protected = (isProtected) => {
  return (req, res, next) => {
    if (!isProtected) {
      req.user = { role: "VIEWER" };
      return next();
    }

    const { authorization } = req.headers;

    if (!authorization) throw new BadRequestException("Token not given");

    const token = authorization.split(" ")[1];

    try {
      const payload = jwt.verify(token, jwtConfig.accessKey);

      req.user = payload;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException("Token expired");
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new BadRequestException("Token is invalid");
      }

      next(error);
    }
  };
};
