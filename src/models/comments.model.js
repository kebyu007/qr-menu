import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, min: 1, required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    imageUrl: { type: String, default: null },
    deviceInfo: { type: String, default: null },
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    updatedBy: { type: String, default: null },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { collection: "comments", timestamps: true, versionKey: false }
);

export const Comment = mongoose.model("Comment", CommentSchema);
