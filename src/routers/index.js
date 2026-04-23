import { Router } from "express";
import authRouter from "./auth.router.js";
import postRouter from "./post.router.js";
import userRouter from "./user.router.js";
import commentRouter from "./comment.router.js";
import likeRouter from "./likes.router.js";

const apiRouter = Router();

apiRouter
  .use("/auth", authRouter)
  .use("/posts", postRouter)
  .use("/users", userRouter)
  .use("/comments", commentRouter)
  .use("/likes", likeRouter);

export default apiRouter;
