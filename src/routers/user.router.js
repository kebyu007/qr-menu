import userController from "../controllers/user.controller.js";
import { upload } from "../configs/multer.config.js";
import { Roles } from "../middlewares/roles.middleware.js";
import { Protected } from "../middlewares/protected.middleware.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", userController.getAll);
userRouter.get("/me", Protected(true), userController.me); // ✅ yangi
userRouter.put("/me", Protected(true), userController.updateMe); // ✅ yangi
userRouter.post(
  "/me/avatar",
  Protected(true), // ✅ yangi
  upload.fields([{ name: "image", maxCount: 1 }]),
  userController.uploadAvatar,
);
userRouter.put(
  "/:id/role",
  Protected(true),
  Roles("ADMIN"),
  userController.changeRole,
); // ✅ yangi
userRouter.delete(
  "/:id",
  Protected(true),
  Roles("ADMIN"),
  userController.deleteUser,
); // ✅ yangi
userRouter.get("/:name", userController.byName);

export default userRouter;
