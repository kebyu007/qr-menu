import PostController from "../controllers/product.controller.js";
import { createPostSchema } from "../schemas/product-category/create-category.schema.js";
import { ValidationMiddleware } from "../middlewares/validation.middleware.js";
import { Router } from "express";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { upload } from "../configs/multer.config.js";

const postRouter = Router();

postRouter.post(
  "/",
  Protected(true),
  Roles("ADMIN", "USER"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  ValidationMiddleware(createPostSchema),
  PostController.createPost,
);
postRouter.get("/", PostController.getPosts);
postRouter.get("/me", Protected(true), PostController.getMyPosts);
postRouter.get("/user/:id", PostController.getUserPosts);
postRouter.get("/:id", PostController.getPostById);
postRouter.put(
  "/:id",
  Protected(true),
  Roles("ADMIN", "USER"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  PostController.updatePost,
);
// ✅ Protected OLDIN kelishi kerak (Roles req.user ishlatadi)
postRouter.delete(
  "/:id",
  Protected(true),
  Roles("ADMIN", "USER"),
  PostController.deletePost,
);

export default postRouter;
