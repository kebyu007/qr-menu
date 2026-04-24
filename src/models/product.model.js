import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String, default: null },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category", required: true },
    imageUrl: { type: String, default: null },
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { collection: "products", timestamps: true, versionKey: false }
);

export const Product = mongoose.model("Product", ProductSchema);
