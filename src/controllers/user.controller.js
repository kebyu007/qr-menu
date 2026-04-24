import { NotFoundException } from "../exceptions/not-found.exception.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

class UserController {
  
  getDashboard = async (req, res, next) => {
    try {
      const totalUsers = await User.countDocuments({ deletedAt: null });
      const totalProducts = await Product.countDocuments({ deletedAt: null });
      const totalCategories = await Category.countDocuments({ deletedAt: null });
      const totalFeedbacks = await Comment.countDocuments({ deletedAt: null });
      const recentFeedbacks = await Comment.find({ deletedAt: null })
        .populate("user", "name email")
        .populate("product", "name")
        .sort("-createdAt")
        .limit(5)
        .lean();

      res.render("admin/dashboard", {
        user: req.user,
        stats: { totalUsers, totalProducts, totalCategories, totalFeedbacks },
        recentFeedbacks,
      });
    } catch (error) {
      next(error);
    }
  };

  
  getProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-password").lean();
      if (!user) throw new NotFoundException("User not found");
      res.render("profile", { user });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
