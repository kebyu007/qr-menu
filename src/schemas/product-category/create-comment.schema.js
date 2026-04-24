import Joi from "joi";

export const CreateFeedbackSchema = Joi.object({
  text: Joi.string().min(1).required(),
  stars: Joi.number().integer().min(1).max(5).required(),
});
