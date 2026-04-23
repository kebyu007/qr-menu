import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(5).required(),
  user: Joi.string().min(10).optional(),
  avatarUrl: Joi.string().optional(),
}).required();
