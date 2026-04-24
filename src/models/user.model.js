import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, min: 3, required: true },
    age: { type: Number, min: 12 },
    email: { type: String, unique: true, required: true },
    password: { type: String, min: 6 },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "VIEWER"],
      default: "USER",
    },
    avatarUrl: { type: String, default: null },
    deletedAt: {
      type: mongoose.SchemaTypes.Date,
      default: null,
    },
  },
  { collection: "users", timestamps: true, versionKey: false },
);

export const User = mongoose.model("User", UserSchema);
