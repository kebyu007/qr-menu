import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { ForbiddenException } from "../exceptions/forbidden.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import fs from "node:fs/promises";
import path from "node:path";
import { sendEmail } from "../helpers/mail.helper.js";
import { Product } from "../models/product.model.js";

class ProductController {
  #_ProductModel;
  constructor() {
    this.#_ProductModel = Product;
  }
  async createProduct(req, res, next) {
    try {
      const { name, price, category } = req.body;

      const existing = await this.#_ProductModel.findOne({ name });

      if (existing) {
        throw new BadRequestException("Product already exists");
      }

      const product = await this.#_ProductModel.create({
        name,
        price,
        category,
        createdBy: req.user.id,
        imageUrl: req.file?.image?.[0]?.filename
          ? `/uploads/${req.file.image[0].filename}`
          : null,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      // Cleanup uploaded files on error
      if (req.file?.image?.[0]?.filename) {
        await fs
          .unlink(
            path.join(process.cwd(), `/uploads/${req.file.image[0].filename}`),
          )
          .catch(() => {});
      }
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const { category } = req.body;
      const posts = await this.#_ProductModel.find({
        deletedAt: null,
        category,
      });

      const total = await this.#_ProductModel.countDocuments(filter);

      res.json({
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const post = await this.#_ProductModel
        .findById(req.params.id)
        .populate("user", "name email");
      if (!post) throw new NotFoundException("post not found");
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      // ✅ req.params.id destructuring xatosi tuzatildi
      const id = req.params.id;
      const user = req.user;
      const { name, price } = req.body || {};

      const foundedCategory = await this.#_ProductModel.findById(id);
      if (!foundedCategory) throw new NotFoundException("Category not found");

      if (
        user.role !== "ADMIN" &&
        String(foundedCategory.user) !== String(user.id)
      ) {
        throw new ForbiddenException("You can not change");
      }

      let imageUrl = foundedCategory.imageUrl;

      // ✅ Fayllar optional - agar yuborilmasa eskisi qoladi
      if (req.file?.image?.[0]?.filename) {
        if (foundedCategory.imageUrl) {
          await fs
            .unlink(path.join(process.cwd(), foundedCategory.imageUrl))
            .catch(() => {});
        }
        imageUrl = `/uploads/${req.file.image[0].filename}`;
      }

      const updated = await this.#_ProductModel.findByIdAndUpdate(
        id,
        {
          title,
          content,
          imageUrl,
          updatedBy: user.id,
          updatedAt: new Date().toLocaleString(),
        },
        { returnDocument: "after" },
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      if (req.file?.image?.[0]?.filename) {
        await fs
          .unlink(
            path.join(process.cwd(), `/uploads/${req.file.image[0].filename}`),
          )
          .catch(() => {});
      }
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const user = req.user;
      // ✅ ADMIN istalgan postni o'chira oladi
      const filter =
        user.role === "ADMIN"
          ? { _id: req.params.id }
          : { _id: req.params.id, user: user.id };

      const post = await this.#_ProductModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          deletedBy: req.user.id,
          deletedAt: new Date().toLocaleString(),
        },
      );
      if (!post) throw new NotFoundException("post not found or forbidden");

      // Fayllarni o'chirish
      if (post.imageUrl)
        await fs
          .unlink(path.join(process.cwd(), post.imageUrl))
          .catch(() => {});

      res.json({ success: true, message: "post deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
