import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { Category } from "../models/category.model.js";

class CategoryController {
  #_CategoryModel;
  constructor() {
    this.#_CategoryModel = Category;
  }

  async getCategory(req, res, next) {
    const category = await this.#_CategoryModel.find();

    res.send({
      success: true,
      data: category,
    });
  }

  async createCategory(req, res, next) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const existing = this.#_CategoryModel.findOne({ name });

      if (existing) {
        throw new BadRequestException("Category already exists");
      }

      const category = await this.#_CategoryModel.create({
        name,
        user: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      const existing = await this.#_CategoryModel.findOneAndUpdate(
        { name },
        { updatedBy: userId, updatedAt: new Date().toLocaleString() },
      );

      if (!existing) {
        throw new BadRequestException("Category not found");
      }

      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }

  uploadAvatar = async (req, res, next) => {
    try {
      const image = req.files?.image?.[0];
      if (!image) throw new NotFoundException("Image not provided");

      const category = await this.#_CategoryModel.findById(req.category.id);

      // Eski avatarni o'chirish
      if (category.avatarUrl) {
        await fs
          .unlink(path.join(process.cwd(), category.avatarUrl))
          .catch(() => {});
      }

      const avatarUrl = `/uploads/${image.filename}`;
      const updated = await this.#_CategoryModel
        .findByIdAndUpdate(req.category.id, { avatarUrl }, { new: true })
        .select("-password");

      res.json({ success: true, data: updated });
    } catch (error) {
      if (req.files?.image?.[0]?.filename) {
        await fs
          .unlink(
            path.join(process.cwd(), `/uploads/${req.files.image[0].filename}`),
          )
          .catch(() => {});
      }
      next(error);
    }
  };

  async deleteCategory(req, res, next) {
    try {
      const category = await this.#_CategoryModel.findByIdAndUpdate(
        {
          _id: req.user.id,
        },
        {
          deletedBy: req.user.id,
          deletedAt: new Date().toLocaleString(),
        },
      );

      if (!category) {
        throw new NotFoundException("category not found");
      }

      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
