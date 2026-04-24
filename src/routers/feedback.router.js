import { Router } from "express";
import feedbackController from "../controllers/feedback.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { createFeedbackSchema } from "../schemas/feedback/create-feedback.schema.js";
import { upload } from "../configs/multer.config.js";

const feedbackRouter = Router();

feedbackRouter.post(
  "/",
  Protected(false),
  upload.fields([{ name: "image", maxCount: 1 }]),
  ValidationMiddleware(createFeedbackSchema),
  feedbackController.createFeedback,
);
feedbackRouter.get("/", Protected(true), Roles("ADMIN"), feedbackController.getFeedback);

export default feedbackRouter;
