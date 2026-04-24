import { Router } from "express";
import { Guest } from "../middlewares/guest-middleware.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { OptionalAuth } from "../middlewares/optional-auth.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { VerifySignatureMiddleware } from "../middlewares/verify-signature.middleware.js";
import { upload } from "../configs/multer.config.js";
import { CreateFeedbackSchema } from "../schemas/product-category/create-comment.schema.js";

import authController from "../controllers/auth.controller.js";
import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js";
import categoryController from "../controllers/category.controller.js";
import feedbackController from "../controllers/comment.controller.js";
import qrController from "../controllers/qr.controller.js";

const viewRouter = Router();

viewRouter.get("/", (req, res) => res.redirect("/menu"));
viewRouter.get("/login", Guest, (req, res) => res.render("login"));
viewRouter.get("/register", Guest, (req, res) => res.render("register"));
viewRouter.get("/forgot-password", Guest, (req, res) => res.render("forgot-password"));
viewRouter.get("/reset-password", VerifySignatureMiddleware, (req, res) =>
  res.render("reset-password", { userId: req.query.userId, signed: req.query.signed })
);

viewRouter.get("/menu", OptionalAuth, productController.getMenu);
viewRouter.get("/menu/:id", OptionalAuth, productController.getProductDetail);
viewRouter.post("/menu/:productId/feedback", Protected(true), upload.single("image"), ValidationMiddleware(CreateFeedbackSchema), feedbackController.createFeedback);
viewRouter.get("/qr", qrController.getViewerQr);

viewRouter.get("/profile", Protected(true), userController.getProfile);

viewRouter.get("/admin", Protected(true), Roles("ADMIN"), userController.getDashboard);

viewRouter.get("/admin/categories", Protected(true), Roles("ADMIN"), categoryController.getCategories);
viewRouter.post("/admin/categories", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.createCategory);
viewRouter.post("/admin/categories/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.updateCategory);
viewRouter.post("/admin/categories/:id/delete", Protected(true), Roles("ADMIN"), categoryController.deleteCategory);

viewRouter.get("/admin/products", Protected(true), Roles("ADMIN"), productController.getProducts);
viewRouter.post("/admin/products", Protected(true), Roles("ADMIN"), upload.single("image"), productController.createProduct);
viewRouter.post("/admin/products/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), productController.updateProduct);
viewRouter.post("/admin/products/:id/delete", Protected(true), Roles("ADMIN"), productController.deleteProduct);

viewRouter.get("/admin/feedback", Protected(true), Roles("ADMIN"), feedbackController.getAllFeedback);
viewRouter.post("/admin/feedback/:id/delete", Protected(true), Roles("ADMIN"), feedbackController.deleteFeedback);

viewRouter.get("/admin/qr", Protected(true), Roles("ADMIN"), qrController.getQrPage);

export default viewRouter;
