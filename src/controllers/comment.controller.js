import { NotFoundException } from "../exceptions/not-found.exception.js";
import { sendEmail } from "../helpers/mail.helper.js";
import { Comment } from "../models/comments.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

class CommentController {
  async createComment(req, res, next) {
    try {
      const { text } = req.body;
      const postId = req.params.id;

      const post = await Post.findById(postId);

      const user = await User.findById(post.user);
      if (!post) {
        throw new NotFoundException("post not found");
      }

      sendEmail(user.email, "Someone commented", `Comment: ${text}`);

      const comment = await Comment.create({
        text,
        post: postId,
        user: req.user.id,
      });

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req, res, next) {
    try {
      const comments = await Comment.find({ post: req.params.id })
        .populate("user", "name email")
        .sort("-createdAt");

      res.json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!comment) {
        throw new NotFoundException("comment not found");
      }

      res.json({
        success: true,
        message: "comment deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
