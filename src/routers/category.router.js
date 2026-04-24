import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { createCategorySchema } from "../schemas/category/create-category.schema.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategory);
categoryRouter.post(
  "/",
  Protected(true),
  Roles("ADMIN"),
  ValidationMiddleware(createCategorySchema),
  categoryController.createCategory,
);

export default categoryRouter;
