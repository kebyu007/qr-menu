import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { createProductSchema } from "../schemas/product-category/create-product.schema.js";
import { upload } from "../configs/multer.config.js";

const productRouter = Router();

productRouter
  .get("/", Protected(true), Roles("ADMIN"), productController.getProducts)
  .post("/", Protected(true), Roles("ADMIN"), upload.single("image"), ValidationMiddleware(createProductSchema), productController.createProduct)
  .post("/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), productController.updateProduct)
  .post("/:id/delete", Protected(true), Roles("ADMIN"), productController.deleteProduct);

export default productRouter;
