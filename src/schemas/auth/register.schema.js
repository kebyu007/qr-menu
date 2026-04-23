import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  age: Joi.number().integer().min(12).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6),
});
