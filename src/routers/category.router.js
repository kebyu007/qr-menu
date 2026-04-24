import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { createCategorySchema } from "../schemas/product-category/create-category.schema.js";
import { upload } from "../configs/multer.config.js";

const categoryRouter = Router();

categoryRouter
  .get("/", Protected(true), Roles("ADMIN"), categoryController.getCategories)
  .post("/", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.createCategory)
  .post("/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.updateCategory)
  .post("/:id/delete", Protected(true), Roles("ADMIN"), categoryController.deleteCategory);

export default categoryRouter;
