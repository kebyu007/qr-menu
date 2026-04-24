import express from "express";
import appConfig from "./configs/app.config.js";
import { connectDb } from "./configs/db.config.js";
import apiRouter from "./routers/index.js";
import { Guest } from "./middlewares/guest-middleware.js";
import { Protected } from "./middlewares/protected.middleware.js";
import { Roles } from "./middlewares/roles.middleware.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { ValidationMiddleware } from "./middlewares/validation.middleware.js";
import path from "node:path";
import authController from "./controllers/auth.controller.js";
import userController from "./controllers/user.controller.js";
import productController from "./controllers/product.controller.js";
import categoryController from "./controllers/category.controller.js";
import feedbackController from "./controllers/feedback.controller.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import expHbs from "express-handlebars";
import { handlebarsHelpers } from "./helpers/handlebars.js";
import { VerifySignatureMiddleware } from "./middlewares/verify-signature.middleware.js";
import { upload } from "./configs/multer.config.js";
import { CreateFeedbackSchema } from "./schemas/product-category/create-comment.schema.js";

config({ quiet: true });
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const hbs = expHbs.create({ extname: "hbs", helpers: handlebarsHelpers });
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDb()
  .then((res) => console.log(res))
  .catch((err) => console.log(err.message));

await authController.seedAdmins();

// ── AUTH VIEWS ────────────────────────────────
app.get("/", (req, res) => res.redirect("/menu"));
app.get("/login", Guest, (req, res) => res.render("login"));
app.get("/register", Guest, (req, res) => res.render("register"));
app.get("/forgot-password", Guest, (req, res) => res.render("forgot-password"));
app.get("/reset-password", VerifySignatureMiddleware, (req, res) => {
  res.render("reset-password", { userId: req.query.userId, signed: req.query.signed });
});

// ── PUBLIC VIEWS ──────────────────────────────
app.get("/menu", productController.getMenu);
app.get("/menu/:id", productController.getProductDetail);
app.post("/menu/:productId/feedback", Protected(true), upload.single("image"), ValidationMiddleware(CreateFeedbackSchema), feedbackController.createFeedback);

// ── USER VIEWS ────────────────────────────────
app.get("/profile", Protected(true), userController.getProfile);

// ── ADMIN VIEWS ───────────────────────────────
app.get("/admin", Protected(true), Roles("ADMIN"), userController.getDashboard);

app.get("/admin/categories", Protected(true), Roles("ADMIN"), categoryController.getCategories);
app.post("/admin/categories", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.createCategory);
app.post("/admin/categories/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), categoryController.updateCategory);
app.post("/admin/categories/:id/delete", Protected(true), Roles("ADMIN"), categoryController.deleteCategory);

app.get("/admin/products", Protected(true), Roles("ADMIN"), productController.getProducts);
app.post("/admin/products", Protected(true), Roles("ADMIN"), upload.single("image"), productController.createProduct);
app.post("/admin/products/:id/update", Protected(true), Roles("ADMIN"), upload.single("image"), productController.updateProduct);
app.post("/admin/products/:id/delete", Protected(true), Roles("ADMIN"), productController.deleteProduct);

app.get("/admin/feedback", Protected(true), Roles("ADMIN"), feedbackController.getAllFeedback);
app.post("/admin/feedback/:id/delete", Protected(true), Roles("ADMIN"), feedbackController.deleteFeedback);

// ── API ROUTES ────────────────────────────────
app.use("/api", apiRouter);

app.use("*splat", (req, res) => {
  res.status(404).render("404", { url: req.url });
});
app.use(ErrorHandlerMiddleware);

process.on("uncaughtException", (err) => { console.log("Uncaught exception", err); process.exit(1); });
const server = app.listen(appConfig.port, () => console.log("Listening on", appConfig.port));
process.on("unhandledRejection", (reason) => { console.log(`Unhandled rejection: ${reason}`); server.close(() => process.exit(1)); });
