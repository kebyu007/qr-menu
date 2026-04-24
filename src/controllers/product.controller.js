import { NotFoundException } from "../exceptions/not-found.exception.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { Comment } from "../models/comments.model.js";
import fs from "node:fs/promises";
import path from "node:path";

class ProductController {
  #_ProductModel;
  #_CategoryModel;
  constructor() {
    this.#_ProductModel = Product;
    this.#_CategoryModel = Category;
  }

  // Admin: barcha productlarni ko'rish
  getProducts = async (req, res, next) => {
    try {
      const { category } = req.query;
      const filter = { deletedAt: null };
      if (category) filter.category = category;

      const products = await this.#_ProductModel.find(filter).populate("category").lean();
      const categories = await this.#_CategoryModel.find({ deletedAt: null }).lean();

      res.render("admin/products", {
        products,
        categories,
        selectedCategory: category || "",
        user: req.user,
        success: req.query.success,
        error: req.query.error,
      });
    } catch (error) {
      next(error);
    }
  };

  // Public: menu sahifasi
  getMenu = async (req, res, next) => {
    try {
      const categories = await this.#_CategoryModel.find({ deletedAt: null }).lean();
      const { category } = req.query;
      const filter = { deletedAt: null };
      if (category) filter.category = category;

      const products = await this.#_ProductModel.find(filter).populate("category").lean();

      res.render("menu", {
        products,
        categories,
        selectedCategory: category || "",
      });
    } catch (error) {
      next(error);
    }
  };

  // Public: bitta product sahifasi (feedback bilan)
  getProductDetail = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.#_ProductModel.findById(id).populate("category").lean();
      if (!product) throw new NotFoundException("Product not found");

      const feedbacks = await Comment.find({ product: id, deletedAt: null })
        .populate("user", "name")
        .sort("-createdAt")
        .lean();

      const avgStars = feedbacks.length
        ? (feedbacks.reduce((sum, f) => sum + f.stars, 0) / feedbacks.length).toFixed(1)
        : null;

      res.render("product-detail", {
        product,
        feedbacks,
        avgStars,
        user: req.user || null,
        success: req.query.success,
        error: req.query.error,
      });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const { name, price, category, description } = req.body;

      const existing = await this.#_ProductModel.findOne({ name, deletedAt: null });
      if (existing) {
        return res.redirect("/admin/products?error=Bu+nomdagi+taom+allaqachon+mavjud");
      }

      await this.#_ProductModel.create({
        name, price, category, description,
        createdBy: req.user.id,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });

      res.redirect("/admin/products?success=Taom+muvaffaqiyatli+qo'shildi");
    } catch (error) {
      if (req.file) await fs.unlink(path.join(process.cwd(), `/uploads/${req.file.filename}`)).catch(() => {});
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, price, category, description } = req.body;

      const existing = await this.#_ProductModel.findById(id);
      if (!existing) throw new NotFoundException("Product not found");

      let imageUrl = existing.imageUrl;
      if (req.file) {
        if (existing.imageUrl) await fs.unlink(path.join(process.cwd(), existing.imageUrl)).catch(() => {});
        imageUrl = `/uploads/${req.file.filename}`;
      }

      await this.#_ProductModel.findByIdAndUpdate(id, {
        name, price, category, description, imageUrl,
        updatedBy: req.user.id,
      });

      res.redirect("/admin/products?success=Taom+yangilandi");
    } catch (error) {
      if (req.file) await fs.unlink(path.join(process.cwd(), `/uploads/${req.file.filename}`)).catch(() => {});
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await this.#_ProductModel.findById(id);
      if (!product) throw new NotFoundException("Product not found");

      await this.#_ProductModel.findByIdAndUpdate(id, {
        deletedBy: req.user.id,
        deletedAt: new Date(),
      });

      res.redirect("/admin/products?success=Taom+o'chirildi");
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
