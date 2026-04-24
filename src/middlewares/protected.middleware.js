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

    const token = req.cookies?.accessToken;
    if (!token) return res.redirect("/");

    try {
      const payload = jwt.verify(token, jwtConfig.accessKey);
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.redirect("/");

        try {
          const payload = jwt.verify(refreshToken, jwtConfig.refreshKey);
          const newAccessToken = jwt.sign(
            { id: payload.id, role: payload.role },
            jwtConfig.accessKey,
            { expiresIn: jwtConfig.accessEx }
          );
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60 * 1000
          });
          req.user = payload;
          return next();
        } catch {
          return res.redirect("/");
        }
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.redirect("/");
      }

      next(error);
    }
  };
};
