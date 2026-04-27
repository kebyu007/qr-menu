import { config } from "dotenv";
import mongoose from "mongoose";

config({ quiet: true });

export const connectDb = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined in environment variables");
  }
  await mongoose.connect(process.env.MONGO_URL);
  return "DB connected ✅";
};
