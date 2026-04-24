import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { createProductSchema } from "../schemas/product/create-product.schema.js";
import { upload } from "../configs/multer.config.js";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.post(
  "/",
  Protected(true),
  Roles("ADMIN"),
  upload.fields([{ name: "image", maxCount: 1 }]),
  ValidationMiddleware(createProductSchema),
  productController.createProduct,
);

export default productRouter;
