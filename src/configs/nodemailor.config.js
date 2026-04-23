import { config } from "dotenv";
import nodemailer from "nodemailer";

config({ quiet: true });

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_ACC_USER,
    pass: process.env.GOOGLE_ACC_PASS,
  },
});

export default transpoter;
