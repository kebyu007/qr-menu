import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, default: null },  // ✅ imageUrl (avatarUrl o'rniga)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    updatedBy: { type: String, default: null },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { collection: "category", timestamps: true, versionKey: false }
);

export const Category = mongoose.model("Category", CategorySchema);
