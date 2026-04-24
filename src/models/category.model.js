import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    avatarUrl: { type: String, default: null },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },
    deletedBy: {
      type: mongoose.SchemaTypes.String,
      default: null,
    },
    deletedAt: {
      type: mongoose.SchemaTypes.Date,
      default: null,
    },
  },
  { collection: "categories", timestamps: true, versionKey: false },
);

export const Category = mongoose.model("Category", CategorySchema);
