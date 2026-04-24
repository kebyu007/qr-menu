import Joi from "joi";

export const createFeedbackSchema = Joi.object({
  message: Joi.string().min(3).required(),
  type: Joi.string().valid("review", "complaint").required(),
  product_id: Joi.string().length(24).required(),
});
