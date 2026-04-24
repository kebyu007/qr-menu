import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 4,
      required: true,
      unique: true,
    },
    price: {
      type: String,
      min: 10,
      required: true,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.SchemaTypes.String,
      default: null,
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
    collection: "products",
    timestamps: true,
    versionKey: false,
  },
);

export const Product = mongoose.model("Product", ProductSchema);
