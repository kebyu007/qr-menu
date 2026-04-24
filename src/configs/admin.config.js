import { config } from "dotenv";

config({ quiet: true });

export default {
  email1: process.env.ADMIN_EMAIL_1,
  pass1: process.env.ADMIN_PASS_1,
};
