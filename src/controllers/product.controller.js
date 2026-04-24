import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { Product } from "../models/product.model.js";

class ProductController {
  #_ProductModel;
  constructor() {
    this.#_ProductModel = Product;
  }
  createProduct = async (req, res, next) => {
    try {
      const { name, price, category_id, description } = req.body;
      const isBrowserForm =
        req.originalUrl.startsWith("/api/") &&
        req.accepts("html") &&
        req.method !== "GET";

      const existing = await this.#_ProductModel.findOne({ name });
      if (existing) throw new BadRequestException("Product already exists");

      const product = await this.#_ProductModel.create({
        name,
        price,
        description,
        category: category_id,
        createdBy: req.user.id,
        imageUrl: req.files?.image?.[0]?.filename
          ? `/uploads/${req.files.image[0].filename}`
          : null,
      });

      if (isBrowserForm) {
        return res.redirect(
          "/admin/dashboard?message=Product%20created%20successfully",
        );
      }

      if (req.originalUrl.startsWith("/api/")) {
        return res.status(201).json({ success: true, data: product });
      }

      return res.redirect("/admin/dashboard");
    } catch (error) {
      next(error);
    }
  };

  getProducts = async (req, res, next) => {
    try {
      const { category_id } = req.query;
      const filter = { deletedAt: null };
      if (category_id) filter.category = category_id;

      const products = await this.#_ProductModel
        .find(filter)
        .populate("category", "name")
        .sort("-createdAt");

      if (req.originalUrl.startsWith("/api/")) {
        return res.json({ success: true, data: products });
      }

      return res.render("menu", {
        title: "Public Menu",
        products,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ProductController();
