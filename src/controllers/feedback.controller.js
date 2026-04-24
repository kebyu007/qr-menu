import { Feedback } from "../models/feedback.model.js";
import { sendEmail } from "../helpers/mail.helper.js";
import logger from "../helpers/logger.helper.js";

class FeedbackController {
  async createFeedback(req, res, next) {
    try {
      const { message, type, product_id } = req.body;
      const isBrowserForm =
        req.originalUrl.startsWith("/api/") &&
        req.accepts("html") &&
        req.method !== "GET";

      const feedback = await Feedback.create({
        message,
        type,
        product_id,
        image: req.files?.image?.[0]?.filename
          ? `/uploads/${req.files.image[0].filename}`
          : null,
        device_info: req.get("user-agent") || "unknown-device",
        user_id: req.user?.id || null,
      });

      logger.info(
        JSON.stringify({
          event: "feedback_submitted",
          type,
          id: feedback._id.toString(),
        }),
      );

      if (type === "complaint" && process.env.ADMIN_NOTIFY_EMAIL) {
        sendEmail(
          process.env.ADMIN_NOTIFY_EMAIL,
          "New complaint from QR menu",
          `Complaint: ${message}`,
        );
      }

      if (isBrowserForm) {
        return res.redirect(
          `/feedback?product_id=${product_id}&message=Feedback%20sent%20successfully`,
        );
      }

      if (req.originalUrl.startsWith("/api/")) {
        return res.status(201).json({ success: true, data: feedback });
      }

      return res.redirect(`/feedback?success=1&product_id=${product_id}`);
    } catch (error) {
      next(error);
    }
  }

  async getFeedback(req, res, next) {
    try {
      const feedbacks = await Feedback.find()
        .populate("product_id", "name")
        .sort("-created_at");

      if (req.originalUrl.startsWith("/api/")) {
        return res.json({ success: true, data: feedbacks });
      }

      return res.render("admin-dashboard", {
        title: "Admin Dashboard",
        feedbacks,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FeedbackController();
