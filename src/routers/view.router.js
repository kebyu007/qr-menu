import { Router } from "express";
import { Guest } from "../middlewares/guest-middleware.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Feedback } from "../models/feedback.model.js";

const viewRouter = Router();

viewRouter.get("/", (req, res) => res.redirect("/menu"));

viewRouter.get("/menu", async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const categoryFilter = { deletedAt: null };
    const productFilter = { deletedAt: null };
    if (category_id) productFilter.category = category_id;

    const categories = await Category.find(categoryFilter).sort("name");
    const products = await Product.find(productFilter)
      .populate("category", "name")
      .sort("-createdAt");

    res.render("menu", { categories, products, selectedCategory: category_id });
  } catch (error) {
    next(error);
  }
});

viewRouter.get("/login", Guest, (req, res) => {
  res.render("login");
});

viewRouter.get("/register", Guest, (req, res) => {
  res.render("register");
});

viewRouter.get("/forgot-password", Guest, (req, res) => {
  res.render("forgot-password");
});

viewRouter.get("/reset-password", (req, res) => {
  res.render("reset-password", {
    userId: req.query.userId,
    signed: req.query.signed,
  });
});

viewRouter.get("/profile", Protected(true), (req, res) => {
  res.render("profile");
});

viewRouter.get("/feedback", (req, res) => {
  Product.find({ deletedAt: null })
    .select("name")
    .sort("name")
    .then((products) => {
      res.render("feedback", {
        products,
        selectedProduct: req.query.product_id,
        message: req.query.success ? "Feedback sent successfully." : undefined,
      });
    })
    .catch((error) => {
      res.render("feedback", { error: error.message });
    });
});

viewRouter.get(
  "/admin/dashboard",
  Protected(true),
  Roles("ADMIN"),
  async (req, res, next) => {
    try {
      const [categories, products, feedbacks] = await Promise.all([
        Category.find({ deletedAt: null }).sort("name"),
        Product.find({ deletedAt: null })
          .populate("category", "name")
          .sort("-createdAt"),
        Feedback.find().populate("product_id", "name").sort("-created_at"),
      ]);

      res.render("admin-dashboard", { categories, products, feedbacks });
    } catch (error) {
      next(error);
    }
  },
);

export default viewRouter;
