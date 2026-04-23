import Joi from "joi";

export const CreateComment = Joi.object({
  text: Joi.string().min(1).required(),
});
