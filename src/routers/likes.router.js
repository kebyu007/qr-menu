import express from "express";
import LikeController from "../controllers/category.controller.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Roles } from "../middlewares/roles.middleware.js";

const likeRouter = express.Router();

likeRouter.post(
  "/post/:id",
  Protected(true),
  Roles("ADMIN", "USER"),
  LikeController.likePost,
);
likeRouter.delete(
  "/post/:id",
  Protected(true),
  Roles("ADMIN", "USER"),
  LikeController.unlikePost,
);

export default likeRouter;
