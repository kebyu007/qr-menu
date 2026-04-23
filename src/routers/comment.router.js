import express from "express";
import CommentController from "../controllers/comment.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";

const commentRouter = express.Router();

commentRouter.post(
  "/post/:id",
  Protected(true),
  Roles("ADMIN", "USER"),
  CommentController.createComment,
);
commentRouter.get("/post/:id", CommentController.getPostComments);
commentRouter.delete("/:id", Protected(true), Roles('ADMIN', 'USER'),CommentController.deleteComment);

export default commentRouter;
