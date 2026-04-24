import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { registerSchema } from "../schemas/auth/register.schema.js";
import { loginSchema } from "../schemas/auth/login.schema.js";
import { VerifySignatureMiddleware } from "../middlewares/verify-signature.middleware.js";
import { Protected } from "../middlewares/protected.middleware.js";

const authRouter = Router();

authRouter
  .post("/login", ValidationMiddleware(loginSchema), authController.login)
  .post("/register", ValidationMiddleware(registerSchema), authController.register)
  .post("/refresh", authController.refresh)
  .post("/reset-password", VerifySignatureMiddleware, authController.resetPass)
  .post("/forgot-password", authController.forgotPass)
  .get("/me", Protected(true), authController.me)
  .get("/logout", authController.logout);

export default authRouter;

