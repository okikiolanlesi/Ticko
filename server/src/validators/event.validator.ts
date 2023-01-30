import joi from "joi";

export const createEventValidator = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  ticketsLeft: joi.number().required(),
  price: joi.number().required(),
});
