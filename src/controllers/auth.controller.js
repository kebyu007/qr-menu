import { User } from "../models/user.model.js";
import bcryct from "bcrypt";
import jwt from "jsonwebtoken";
import jwtConfig from "../configs/jwt.config.js";
import { signature } from "../configs/signature.config.js";
import { config } from "dotenv";
import { ConflictException } from "../exceptions/conflict.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { sendEmail } from "../helpers/mail.helper.js";
import adminConfig from "../configs/admin.config.js";

config({ quiet: true });
const BASE_URL = process.env.BASE_URL;

class AuthController {
  #_UserModel;
  constructor() {
    this.#_UserModel = User;
  }

  register = async (req, res, next) => {
    try {
      const { name, email, age, password } = req.body;

      const existingUser = await this.#_UserModel.findOne({ email });
      if (existingUser) {
        // throw new ConflictException(`Given email: ${email} already exists`);
        return res.render("login", {
          error: `Given email: ${email} already exists`,
        });
      }

      const hPass = await this.#_hashPass(password);

      // ✅ create ishlatildi (insertOne async emas edi, _id ham yo'q edi)
      const newUser = await this.#_UserModel.create({
        name,
        age,
        email,
        password: hPass,
      });

      const accessToken = this.#_accessToken({
        id: newUser._id,
        role: newUser.role,
      });
      const refreshToken = this.#_refreshToken({
        id: newUser._id,
        role: newUser.role,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const existingUser = await this.#_UserModel.findOne({ email });

      if (!existingUser) {
        return res.render("login", { error: "Email topilmadi" });
      }

      const comparePassword = await this.#_comparePass(
        password,
        existingUser.password,
      );

      if (!comparePassword) {
        return res.render("login", { error: "Parol noto'g'ri" });
      }

      const accessToken = this.#_accessToken({
        id: existingUser._id,
        role: existingUser.role,
      });
      const refreshToken = this.#_refreshToken({
        id: existingUser._id,
        role: existingUser.role,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log({
        success: true,
        data: { accessToken, refreshToken },
      });
      res.redirect("/profile");
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new BadRequestException("Token not given");

      const payload = jwt.verify(refreshToken, jwtConfig.refreshKey);
      const accessToken = this.#_accessToken({
        id: payload.id,
        role: payload.role,
      });

      res.send({ success: true, data: { accessToken } });
    } catch (error) {
      next(error);
    }
  };

  forgotPass = async (req, res, next) => {
    try {
      const { email } = req.body;
      const existing = await this.#_UserModel.findOne({ email });
      if (!existing) throw new NotFoundException("User not found");

      const signedUrl = signature.sign(
        `${BASE_URL}/reset-password?userId=${existing._id}`, // ✅ /api/auth yo'q
        { ttl: 300 },
      );
      sendEmail(
        email,
        "Forgot password request",
        `Reset Password link: ${signedUrl}`,
      );
      res.render("forgot-password", {
        message: "Reset password link sent to your email.",
      });
    } catch (error) {
      next(error);
    }
  };

  resetPass = async (req, res, next) => {
    try {
      const { userId } = req.query;
      const { password } = req.body;

      // ✅ updateOne filter va update ajratildi
      await this.#_UserModel.updateOne(
        { _id: userId },
        { password: await this.#_hashPass(password) },
      );
      res.render("login", {
        message: "Your password was updated, Login now",
      });
    } catch (error) {
      next(error);
    }
  };

  // ✅ /api/auth/me endpoint uchun
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

  seedAdmins = async () => {
    const admins = [
      {
        name: "admin",
        age: 25,
        email: adminConfig.email1,
        password: adminConfig.pass1,
      },
    ];
    for (let a of admins) {
      const existingUser = await this.#_UserModel.findOne({ email: a.email });
      if (!existingUser) {
        await this.#_UserModel.create({
          ...a,
          role: "ADMIN",
          password: await this.#_hashPass(a.password),
        });
      }
    }
    console.log("ADMINS SEEDED");
  };

  logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/login");
  };

  #_hashPass = async (pass) => await bcryct.hash(pass, 10);
  #_comparePass = async (originalPass, hPass) =>
    await bcryct.compare(originalPass, hPass);
  #_accessToken = (payload) =>
    jwt.sign(payload, jwtConfig.accessKey, { expiresIn: jwtConfig.accessEx });
  #_refreshToken = (payload) =>
    jwt.sign(payload, jwtConfig.refreshKey, { expiresIn: jwtConfig.refreshEx });
}

export default new AuthController();
// Logout — buni class ichiga qo'shish kerak edi, shuning uchun alohida export qilamiz
