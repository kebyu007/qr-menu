import { NotFoundException } from "../exceptions/not-found.exception.js";
import { sendEmail } from "../helpers/mail.helper.js";
import { Comment } from "../models/comments.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { config } from "dotenv";
import logger from "../helpers/logger.helper.js";

config({ quiet: true });

class FeedbackController {
  
  createFeedback = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const { text, stars } = req.body;

      const foundProduct = await Product.findById(productId);
      if (!foundProduct) throw new NotFoundException("Product not found");

      const deviceInfo = req.headers["user-agent"] || "Unknown device";

      const feedback = await Comment.create({
        text,
        stars: Number(stars),
        product: productId,
        user: req.user.id,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        deviceInfo,
      });

      logger.info(`New feedback submitted: ${feedback._id}`);

      const admin = await User.findOne({ role: "ADMIN" });
      if (admin) {
        sendEmail(
          admin.email,
          "New Feedback Received",
          `Product: ${foundProduct.name}\nRating: ${stars} stars\nComment: ${text}\nDevice: ${deviceInfo}`
        );
      }

      res.redirect(`/menu/${productId}?success=Fikringiz+qabul+qilindi`);
    } catch (error) {
      next(error);
    }
  };

  
  getAllFeedback = async (req, res, next) => {
    try {
      const feedbacks = await Comment.find({ deletedAt: null })
        .populate("user", "name email")
        .populate("product", "name")
        .sort("-createdAt")
        .lean();

      res.render("admin/feedback", {
        feedbacks,
        user: req.user,
        success: req.query.success,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteFeedback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const feedback = await Comment.findById(id);
      if (!feedback) throw new NotFoundException("Feedback not found");

      await Comment.findByIdAndUpdate(id, {
        deletedBy: req.user.id,
        deletedAt: new Date(),
      });

      res.redirect("/admin/feedback?success=Feedback+o'chirildi");
    } catch (error) {
      next(error);
    }
  };
}

export default new FeedbackController();
