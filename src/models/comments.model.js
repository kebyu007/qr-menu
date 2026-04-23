import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      min: 1,
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "product",
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
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
  {
    collection: "comments",
    timestamps: true,
    versionKey: false,
  },
);

export const Comment = mongoose.model("Comment", CommentSchema);
