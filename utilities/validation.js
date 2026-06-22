const Joi = require("joi");

const userRegisterSchema = Joi.object({
  name: Joi.string().pattern(/^[A-Za-z ]+$/).min(3).max(20).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().trim().min(6).required(),
});


const userLoginSchema = Joi.object({
    email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
    password: Joi.string().trim().min(6).required()
});

const itemSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().trim().required(),
  productName: Joi.string().pattern(/^[A-Za-z ]+$/).required(),
  category: Joi.string().trim().valid("electronics", "beauty", "clothes", "groceries", "footwear", "other").required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(1).required()
});


const checkoutSchema = Joi.object({
    userId: Joi.string().trim().required()
});

const removeItemSchema = Joi.object({
    userId: Joi.string().trim().required(),
    productId: Joi.string().trim().required()
});

module.exports = {userRegisterSchema, userLoginSchema, itemSchema, checkoutSchema, removeItemSchema}