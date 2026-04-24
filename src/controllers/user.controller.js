import { NotFoundException } from "../exceptions/not-found.exception.js";
import { User } from "../models/user.model.js";
import fs from "node:fs/promises";
import path from "node:path";

class UserController {
  #_UserModel;
  constructor() {
    this.#_UserModel = User;
  }

  getAll = async (req, res, next) => {
    try {
      let {
        page = 1,
        limit = 10,
        search = "",
        sort = "-createdAt",
      } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const filter = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const allowedSort = ["name", "email", "createdAt"];
      const field = sort.startsWith("-") ? sort.slice(1) : sort;
      if (!allowedSort.includes(field)) sort = "-createdAt";

      const users = await this.#_UserModel
        .find(filter)
        .select("-password")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await this.#_UserModel.countDocuments(filter);

      res.json({
        success: true,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  // ✅ Yangi: o'z profilini olish
  me = async (req, res, next) => {
    try {
      const user = await this.#_UserModel
        .findById(req.user.id)
        .select("-password");
      if (!user) throw new NotFoundException("User not found");
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  // ✅ Yangi: o'z profilini yangilash
  updateMe = async (req, res, next) => {
    try {
      const { name, age } = req.body;
      const updated = await this.#_UserModel
        .findByIdAndUpdate(
          req.user.id,
          { name, age, up },
          { returnDocument: "after" },
        )
        .select("-password");

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  // ✅ Yangi: avatar yuklash
  uploadAvatar = async (req, res, next) => {
    try {
      const image = req.files?.image?.[0];
      if (!image) throw new NotFoundException("Image not provided");

      const user = await this.#_UserModel.findById(req.user.id);

      // Eski avatarni o'chirish
      if (user.avatarUrl) {
        await fs
          .unlink(path.join(process.cwd(), user.avatarUrl))
          .catch(() => {});
      }

      const avatarUrl = `/uploads/${image.filename}`;
      const updated = await this.#_UserModel
        .findByIdAndUpdate(req.user.id, { avatarUrl }, { new: true })
        .select("-password");

      res.json({ success: true, data: updated });
    } catch (error) {
      if (req.files?.image?.[0]?.filename) {
        await fs
          .unlink(
            path.join(process.cwd(), `/uploads/${req.files.image[0].filename}`),
          )
          .catch(() => {});
      }
      next(error);
    }
  };

  changeRole = async (req, res, next) => {
    try {
      const { role } = req.body;
      const updated = await this.#_UserModel
        .findByIdAndUpdate(req.params.id, { role }, { new: true })
        .select("-password");
      if (!updated) throw new NotFoundException("User not found");
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const user = await this.#_UserModel.findByIdAndDelete(req.params.id);
      if (!user) throw new NotFoundException("User not found");
      res.json({ success: true, message: "User deleted" });
    } catch (error) {
      next(error);
    }
  };

}

export default new UserController();
