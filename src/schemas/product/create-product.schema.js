import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).required(),
  price: Joi.number().positive().required(),
  category_id: Joi.string().length(24).required(),
  description: Joi.string().allow("").max(500).optional(),
});
