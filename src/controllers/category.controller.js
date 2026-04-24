import { NotFoundException } from "../exceptions/not-found.exception.js";
import { Category } from "../models/category.model.js";
import fs from "node:fs/promises";
import path from "node:path";

class CategoryController {
  #_CategoryModel;
  constructor() { this.#_CategoryModel = Category; }

  getCategories = async (req, res, next) => {
    try {
      const categories = await this.#_CategoryModel.find({ deletedAt: null }).lean();
      res.render("admin/categories", { categories, user: req.user });
    } catch (error) { next(error); }
  };

  createCategory = async (req, res, next) => {
    try {
      const { name } = req.body;
      const existing = await this.#_CategoryModel.findOne({ name, deletedAt: null });
      if (existing) return res.redirect("/admin/categories?error=Bu+kategoriya+allaqachon+mavjud");

      await this.#_CategoryModel.create({
        name, user: req.user.id,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      });
      res.redirect("/admin/categories?success=Kategoriya+qo'shildi");
    } catch (error) {
      if (req.file) await fs.unlink(path.join(process.cwd(), `/uploads/${req.file.filename}`)).catch(() => {});
      next(error);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const existing = await this.#_CategoryModel.findById(id);
      if (!existing) throw new NotFoundException("Category not found");

      let imageUrl = existing.imageUrl;
      if (req.file) {
        if (existing.imageUrl) await fs.unlink(path.join(process.cwd(), existing.imageUrl)).catch(() => {});
        imageUrl = `/uploads/${req.file.filename}`;
      }
      await this.#_CategoryModel.findByIdAndUpdate(id, { name, imageUrl, updatedBy: req.user.id });
      res.redirect("/admin/categories?success=Kategoriya+yangilandi");
    } catch (error) {
      if (req.file) await fs.unlink(path.join(process.cwd(), `/uploads/${req.file.filename}`)).catch(() => {});
      next(error);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await this.#_CategoryModel.findById(id);
      if (!category) throw new NotFoundException("Category not found");
      await this.#_CategoryModel.findByIdAndUpdate(id, { deletedBy: req.user.id, deletedAt: new Date() });
      res.redirect("/admin/categories?success=Kategoriya+o'chirildi");
    } catch (error) { next(error); }
  };
}

export default new CategoryController();
