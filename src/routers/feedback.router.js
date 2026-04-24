import { Router } from "express";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { CreateFeedbackSchema } from "../schemas/product-category/create-comment.schema.js";
import { upload } from "../configs/multer.config.js";

const feedbackRouter = Router();

feedbackRouter
  .get("/admin", Protected(true), Roles("ADMIN"), feedbackController.getAllFeedback)
  .post("/:id/delete", Protected(true), Roles("ADMIN"), feedbackController.deleteFeedback);

export default feedbackRouter;
