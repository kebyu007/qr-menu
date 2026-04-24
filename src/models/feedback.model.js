import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, minlength: 3 },
    type: {
      type: String,
      enum: ["review", "complaint"],
      required: true,
      default: "review",
    },
    image: { type: String, default: null },
    device_info: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { collection: "feedback", versionKey: false, timestamps: false },
);

export const Feedback = mongoose.model("Feedback", FeedbackSchema);
