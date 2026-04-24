import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { Category } from "../models/category.model.js";

class CategoryController {
  #_CategoryModel;
  constructor() {
    this.#_CategoryModel = Category;
  }

  getCategory = async (req, res, next) => {
    try {
      const categories = await this.#_CategoryModel
        .find({ deletedAt: null })
        .sort("name");

      if (req.originalUrl.startsWith("/api/")) {
        return res.json({ success: true, data: categories });
      }

      return res.render("menu", {
        title: "Menu",
        categories,
      });
    } catch (error) {
      next(error);
    }
  };

  createCategory = async (req, res, next) => {
    try {
      const { name } = req.body;
      const isBrowserForm =
        req.originalUrl.startsWith("/api/") &&
        req.accepts("html") &&
        req.method !== "GET";

      const existing = await this.#_CategoryModel.findOne({ name });

      if (existing) {
        throw new BadRequestException("Category already exists");
      }

      const category = await this.#_CategoryModel.create({
        name,
        user: req.user.id,
      });

      if (isBrowserForm) {
        return res.redirect(
          "/admin/dashboard?message=Category%20created%20successfully",
        );
      }

      if (req.originalUrl.startsWith("/api/")) {
        return res.status(201).json({ success: true, data: category });
      }

      return res.redirect("/admin/dashboard");
    } catch (error) {
      next(error);
    }
  };
}

export default new CategoryController();
